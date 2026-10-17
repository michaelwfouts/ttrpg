import type { Category } from '../types/content'

/**
 * One entry per folder under /content. To add a category, create the folder
 * and add an entry here; routing, home cards, nav and search pick it up.
 */
export const categories: Category[] = [
  {
    id: 'one-shots',
    label: 'One-Shots',
    icon: 'i-lucide-scroll-text',
    description: 'Self-contained adventures for a single session.',
  },
  {
    id: 'combats',
    label: 'Combats',
    icon: 'i-lucide-swords',
    description: 'Encounters and set-piece fights, ready to drop in.',
  },
  {
    id: 'dungeons',
    label: 'Dungeons',
    icon: 'i-lucide-castle',
    description: 'Maps, rooms and keyed locations to explore.',
  },
]

export const categoryById = (id: string): Category | undefined => categories.find((c) => c.id === id)
