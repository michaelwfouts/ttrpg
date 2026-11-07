import { Marked, type Token, type Tokens } from 'marked'
import { parse as parseYaml } from 'yaml'
import type { DocFrontmatter, DocHeading } from '../types/content'
import { renderCreature } from './parseCreature'

const FRONTMATTER = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

type HeadingToken = Tokens.Heading & { id?: string }

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** marked HTML-escapes text tokens; undo that so headings can be shown as plain text. */
function decodeEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

function inlineText(tokens: Token[] | undefined): string {
  if (!tokens) return ''
  return tokens
    .map((t) => ('tokens' in t && t.tokens ? inlineText(t.tokens) : ('text' in t ? String(t.text) : t.raw)))
    .join('')
}

// `\b` would also match `creature-index`, so require a space or the end after the tag.
const isCreature = (lang: string | undefined) => /^creature(\s|$)/.test(lang ?? '')
const CREATURE_INDEX = 'creature-index'

interface FoundCreature {
  token: Tokens.Code
  /** The nearest heading above the card, shown as "From: ..." in the index. */
  heading: string
}

/** Every stat card in the doc, re-rendered in page order with the section each came from. */
function renderCreatureIndex(found: FoundCreature[]): string {
  if (!found.length) return ''
  const cards = found.map(({ token, heading }) => {
    const from = heading ? `<p class="creature-index-source">From: ${escapeHtml(heading)}</p>` : ''
    return renderCreature(token.text, token.lang) + from
  })
  return `<div class="creature-index">${cards.join('')}</div>\n`
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Own instance so we never touch marked's global defaults.
const marked = new Marked({
  renderer: {
    heading(token) {
      const { id } = token as HeadingToken
      const body = this.parser.parseInline(token.tokens)
      return `<h${token.depth} id="${id}">${body}</h${token.depth}>\n`
    },
    code(token) {
      const lang = token.lang ?? ''
      // Any other fenced block falls back to marked's default rendering.
      return isCreature(lang) ? renderCreature(token.text, lang) : false
    },
  },
})

/** Parse one markdown file into metadata, rendered HTML and a heading outline. Pure function. */
export function parseDoc(raw: string, slug: string): {
  meta: DocFrontmatter
  html: string
  headings: DocHeading[]
  plainText: string
} {
  const match = FRONTMATTER.exec(raw)
  const data = (match && match[1] ? parseYaml(match[1]) : {}) as Partial<DocFrontmatter> | null
  const body = match ? match[2] : raw

  const tokens = marked.lexer(body)
  const kept: Token[] = []
  const headings: DocHeading[] = []
  const used = new Map<string, number>()
  const creatures: FoundCreature[] = []
  let h1Title = ''
  let section = ''

  for (const t of tokens) {
    if (t.type === 'heading') {
      const heading = t as HeadingToken
      const text = decodeEntities(inlineText(heading.tokens)).trim()
      // The first H1 is the page title, shown by the page header instead.
      if (heading.depth === 1 && !h1Title) {
        h1Title = text
        continue
      }
      const base = slugify(text) || 'section'
      const n = used.get(base) ?? 0
      used.set(base, n + 1)
      heading.id = n === 0 ? base : `${base}-${n}`
      headings.push({ depth: heading.depth, text, id: heading.id })
      section = text
    }
    // Walk into lists and quotes too, so cards nested in list items are found.
    marked.walkTokens([t], (inner) => {
      if (inner.type === 'code' && isCreature(inner.lang)) creatures.push({ token: inner as Tokens.Code, heading: section })
    })
    kept.push(t)
  }

  // Second pass: the index usually sits after the cards it gathers, so it can only be filled in now.
  const index = renderCreatureIndex(creatures)
  marked.walkTokens(kept, (t) => {
    if (t.type === 'code' && t.lang?.trim() === CREATURE_INDEX) {
      Object.assign(t, { type: 'html', block: true, pre: false, text: index })
    }
  })

  const tags = data?.tags as unknown
  const meta: DocFrontmatter = {
    ...(data ?? {}),
    title: typeof data?.title === 'string' && data.title ? data.title : h1Title || slug,
    tags: tags === undefined ? undefined : Array.isArray(tags) ? tags.map(String) : [String(tags)],
  }

  return {
    meta,
    html: marked.parser(kept),
    headings,
    plainText: body.replace(/[#>*_`|\\-]+/g, ' ').replace(/\s+/g, ' '),
  }
}
