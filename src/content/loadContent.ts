import { categoryById } from './categories'
import { parseDoc } from './parseDoc'
import type { Doc } from '../types/content'

const files = import.meta.glob('/content/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function loadDocs(): Doc[] {
  const docs: Doc[] = []
  for (const [path, raw] of Object.entries(files)) {
    const [, , category, file] = path.split('/') // ['', 'content', category, file]
    const slug = file.replace(/\.md$/, '')
    if (!categoryById(category)) {
      console.warn(`Skipping "${path}": "${category}" is not registered in src/content/categories.ts`)
      continue
    }
    try {
      docs.push({ category, slug, ...parseDoc(raw, slug) })
    } catch (err) {
      console.warn(`Skipping "${path}": failed to parse`, err)
    }
  }
  return docs.sort((a, b) => a.meta.title.localeCompare(b.meta.title))
}

export const docs: Doc[] = loadDocs()
