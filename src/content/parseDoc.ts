import { Marked, type Token, type Tokens } from 'marked'
import { parse as parseYaml } from 'yaml'
import type { DocFrontmatter, DocHeading } from '../types/content'

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

// Own instance so we never touch marked's global defaults.
const marked = new Marked({
  renderer: {
    heading(token) {
      const { id } = token as HeadingToken
      const body = this.parser.parseInline(token.tokens)
      return `<h${token.depth} id="${id}">${body}</h${token.depth}>\n`
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
  let h1Title = ''

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
    }
    kept.push(t)
  }

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
