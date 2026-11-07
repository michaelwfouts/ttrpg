import { Marked, type Token, type Tokens } from 'marked'

/**
 * Creature stat cards, written in a fenced block:
 *
 *   ```creature nimble
 *   Giant Spider
 *   Level 2 Medium Beast
 *   HP: 27 | Armor: Medium | Speed: 6
 *
 *   > **Ambusher.** Passive traits and conditions become ribbon banners.
 *
 *   - **Bite.** Actions are bullets.
 *
 *   ---
 *
 *   **BLOODIED:** At **100 HP**, ...
 *   ```
 *
 * The word after `creature` picks a system profile, which maps that system's stat names
 * onto the four fixed slots (HP, Armor, Speed, Saves) so HP always sits in the same place.
 */

export type StatSlot = 'hp' | 'armor' | 'speed' | 'saves'

export interface CreatureStat {
  /** Fixed slot, or undefined for a system-specific extra stat shown as a labeled pill. */
  slot?: StatSlot
  label: string
  value: string
}

export interface Creature {
  name: string
  subtitle: string
  /** Ordered for display: extras first, then Saves, Speed, Armor, and HP last (top-right corner). */
  stats: CreatureStat[]
  /** Markdown below the header: ribbons (`>`), action bullets, dividers and plain lines. */
  body: string
}

interface SystemProfile {
  aliases: Record<string, StatSlot>
  format?: Partial<Record<StatSlot, (value: string) => string>>
}

const COMMON_ALIASES: Record<string, StatSlot> = {
  hp: 'hp',
  health: 'hp',
  'hit points': 'hp',
  armor: 'armor',
  ac: 'armor',
  'armor class': 'armor',
  speed: 'speed',
  movement: 'speed',
  move: 'speed',
  saves: 'saves',
  'saving throws': 'saves',
}

const NIMBLE_ARMOR: Record<string, string> = { none: '', light: 'L', medium: 'M', heavy: 'H' }

/** Systems not listed here (cypher, 5e, ...) only need the common aliases. */
const SYSTEMS: Record<string, SystemProfile> = {
  nimble: {
    aliases: {},
    // Nimble prints armor as a single letter, and no armor as nothing at all.
    format: { armor: (v) => NIMBLE_ARMOR[v.toLowerCase()] ?? v },
  },
}

const SLOT_LABELS: Record<StatSlot, string> = { hp: 'HP', armor: 'Armor', speed: 'Speed', saves: 'Saves' }
const SLOT_ORDER: StatSlot[] = ['saves', 'speed', 'armor', 'hp']

/** A header line is a stat line when every `|`-separated part is `Key: value` (bold markers ignored). */
const STAT_PART = /^\s*([A-Za-z][A-Za-z ]*?)\s*:\s*(\S.*?)\s*$/

function stripMarks(text: string): string {
  return text.replace(/^[#\s]+/, '').replace(/^[*_]+|[*_]+$/g, '').trim()
}

function parseStatLine(line: string, profile: SystemProfile): CreatureStat[] | null {
  const stats: CreatureStat[] = []
  for (const part of line.replace(/\*+/g, '').split('|')) {
    const m = STAT_PART.exec(part)
    if (!m) return null
    const key = m[1].toLowerCase()
    const value = m[2]
    const slot = profile.aliases[key] ?? COMMON_ALIASES[key]
    if (!slot) {
      stats.push({ label: m[1], value })
      continue
    }
    const formatted = profile.format?.[slot]?.(value) ?? value
    if (formatted) stats.push({ slot, label: SLOT_LABELS[slot], value: formatted })
  }
  return stats
}

/** Parse the text inside a ```creature fence. Pure function. */
export function parseCreature(source: string, system = ''): Creature {
  const profile = SYSTEMS[system.toLowerCase()] ?? { aliases: {} }
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  while (lines.length && !lines[0].trim()) lines.shift()

  const blank = lines.findIndex((l) => !l.trim())
  const header = blank === -1 ? lines : lines.slice(0, blank)
  const body = blank === -1 ? '' : lines.slice(blank + 1).join('\n').trim()

  const [first = '', ...rest] = header
  const subtitle: string[] = []
  const stats: CreatureStat[] = []
  for (const line of rest) {
    const parsed = parseStatLine(line, profile)
    if (parsed) stats.push(...parsed)
    else subtitle.push(stripMarks(line))
  }

  const extras = stats.filter((s) => !s.slot)
  const slotted = SLOT_ORDER.flatMap((slot) => stats.filter((s) => s.slot === slot))

  return {
    name: stripMarks(first),
    subtitle: subtitle.join(' '),
    stats: [...extras, ...slotted],
    body,
  }
}

// Own instance so card rendering never picks up the doc renderer's overrides.
const md = new Marked()

const inline = (text: string) => md.parseInline(text, { async: false }) as string

const ICONS: Record<StatSlot, string> = {
  hp: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
  armor: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
  speed: 'M4 4h9l7 8-7 8H4l7-8z',
  saves: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
}

function renderStat(stat: CreatureStat): string {
  if (!stat.slot) {
    return `<span class="creature-stat"><span class="creature-stat-label">${inline(stat.label)}</span> ${inline(stat.value)}</span>`
  }
  const icon = `<svg class="creature-stat-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[stat.slot]}"/></svg>`
  return `<span class="creature-stat creature-stat-${stat.slot}" title="${stat.label}">${icon}<span class="sr-only">${stat.label} </span>${inline(stat.value)}</span>`
}

/** Each source line in a ribbon or paragraph is its own line on the card. */
function lineParagraphs(text: string, cls?: (line: string) => string | undefined): string {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const c = cls?.(l)
      return c ? `<p class="${c}">${inline(l)}</p>` : `<p>${inline(l)}</p>`
    })
    .join('')
}

const PHASE = /^\*\*(BLOODIED|LAST STAND)\b/i

function renderBody(body: string): string {
  return md
    .lexer(body)
    .map((t: Token) => {
      switch (t.type) {
        case 'blockquote':
          return `<div class="creature-ribbon">${lineParagraphs((t as Tokens.Blockquote).text)}</div>`
        case 'hr':
          return '<hr class="creature-rule">'
        case 'paragraph':
          return lineParagraphs((t as Tokens.Paragraph).text, (l) => (PHASE.test(l) ? 'creature-phase' : undefined))
        case 'space':
          return ''
        default:
          return md.parser([t])
      }
    })
    .join('')
}

/** Render a ```creature fence as a stat card. `info` is the fence's info string, e.g. "creature cypher". */
export function renderCreature(source: string, info = 'creature'): string {
  const system = info.trim().split(/\s+/)[1] ?? ''
  const m = parseCreature(source, system)
  const stats = m.stats.length ? `<div class="creature-stats">${m.stats.map(renderStat).join('')}</div>` : ''
  const subtitle = m.subtitle ? `<p class="creature-subtitle">${inline(m.subtitle)}</p>` : ''
  const body = m.body ? `<div class="creature-body">${renderBody(m.body)}</div>` : ''
  return (
    `<section class="creature" aria-label="${m.name.replace(/"/g, '&quot;')} stat block">` +
    `<header class="creature-header"><div><p class="creature-name">${inline(m.name)}</p>${subtitle}</div>${stats}</header>` +
    `${body}</section>\n`
  )
}
