export interface DocFrontmatter {
  title: string
  description?: string
  system?: string
  duration?: string
  players?: string
  tags?: string[]
}

export interface DocHeading {
  /** 1-6, matching the markdown heading level */
  depth: number
  text: string
  id: string
}

export interface Doc {
  category: string
  slug: string
  meta: DocFrontmatter
  html: string
  headings: DocHeading[]
  /** Markdown stripped to plain words, used only for search */
  plainText: string
}

export interface Category {
  id: string
  label: string
  icon: string
  description: string
}
