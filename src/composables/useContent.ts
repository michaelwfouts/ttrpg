import { docs } from '../content/loadContent'
import { categories, categoryById } from '../content/categories'
import type { Doc } from '../types/content'

export function useContent() {
  const docsIn = (category: string): Doc[] => docs.filter((d) => d.category === category)
  const find = (category: string, slug: string): Doc | undefined =>
    docs.find((d) => d.category === category && d.slug === slug)
  return { docs, categories, categoryById, docsIn, find }
}
