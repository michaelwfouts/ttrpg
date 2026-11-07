import { describe, expect, it } from 'vitest'
import { parseDoc } from './parseDoc'

const SAMPLE = `---
title: Frontmatter Title
description: A thing
tags: [horror, winter]
---

# H1 Title

## 2. Old Man Winter

### Arrival

Text with *emphasis*.

### Arrival

## Cyphers & Handouts
`

describe('parseDoc', () => {
  it('reads frontmatter and prefers its title', () => {
    const { meta } = parseDoc(SAMPLE, 'slug')
    expect(meta.title).toBe('Frontmatter Title')
    expect(meta.description).toBe('A thing')
    expect(meta.tags).toEqual(['horror', 'winter'])
  })

  it('falls back to the H1, then the slug, without frontmatter', () => {
    expect(parseDoc('# Hello\n\n## A', 's').meta.title).toBe('Hello')
    expect(parseDoc('## A', 'my-slug').meta.title).toBe('my-slug')
  })

  it('builds headings with unique ids, decoded text, and no H1', () => {
    const { headings, html } = parseDoc(SAMPLE, 'slug')
    expect(headings.map((h) => h.id)).toEqual(['2-old-man-winter', 'arrival', 'arrival-1', 'cyphers-handouts'])
    expect(headings.find((h) => h.id === 'cyphers-handouts')!.text).toBe('Cyphers & Handouts')
    expect(html).toContain('<h2 id="2-old-man-winter">')
    expect(html).not.toContain('<h1')
  })

  it('handles CRLF line endings', () => {
    const { meta } = parseDoc('---\r\ntitle: X\r\n---\r\n## A\r\n', 's')
    expect(meta.title).toBe('X')
  })
})

describe('creature-index', () => {
  const DOC = `## The Church

\`\`\`creature cypher
Reverend Cutlip
Health: 20
\`\`\`

## The Mine

- **Combatants**

  \`\`\`creature cypher
  The Kindled
  Health: 4
  \`\`\`

## Appendix

\`\`\`creature-index
\`\`\`
`

  it('gathers every card in page order, including nested ones, with its section', () => {
    const { html } = parseDoc(DOC, 's')
    const index = html.slice(html.indexOf('<div class="creature-index">'))
    expect(index.indexOf('Reverend Cutlip')).toBeGreaterThan(-1)
    expect(index.indexOf('The Kindled')).toBeGreaterThan(index.indexOf('Reverend Cutlip'))
    expect(index).toContain('From: The Church')
    expect(index).toContain('From: The Mine')
    expect(html.match(/<section class="creature"/g)).toHaveLength(4)
  })

  it('renders nothing when the doc has no creatures, and is never a code block or card', () => {
    const { html } = parseDoc('```creature-index\n```\n', 's')
    expect(html.trim()).toBe('')
  })

  it('does not count the index as a creature card', () => {
    const { html } = parseDoc('```creature-index\n```\n\n```creature\nGoblin\n```\n', 's')
    expect(html.match(/<section class="creature"/g)).toHaveLength(2)
    expect(html).not.toContain('<code')
  })
})
