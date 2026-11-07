import { describe, expect, it } from 'vitest'
import { parseCreature, renderCreature } from './parseCreature'
import { parseDoc } from './parseDoc'

const FLORINDRIS = `Florindris, Bane of the Forest
Level 7 Solo Large Floral Dragon
HP: 200 | Armor: Medium | Saves: ALL+

> **Aura of Wind.** Ranged attacks against you have disadvantage.
> **Wither.** Resistant to necrotic damage.

---

**ACTIONS:** After each hero's turn, choose one:
- **Gust.** (Reach 8) Move a target 1d10 spaces.

---

**BLOODIED:** At **100 HP**, Petal Storm recharges.
**LAST STAND:** **70** more damage and she dies.`

describe('parseCreature', () => {
  it('splits name, subtitle, stats and body', () => {
    const m = parseCreature(FLORINDRIS, 'nimble')
    expect(m.name).toBe('Florindris, Bane of the Forest')
    expect(m.subtitle).toBe('Level 7 Solo Large Floral Dragon')
    expect(m.body.startsWith('> **Aura of Wind.**')).toBe(true)
  })

  it('always puts HP last, after Armor, with extras first', () => {
    const m = parseCreature('X\nHP: 6 | Damage: 2 | Movement: Short | Armor: 0', 'cypher')
    expect(m.stats.map((s) => s.slot ?? s.label)).toEqual(['Damage', 'speed', 'armor', 'hp'])
  })

  it('maps system stat names onto the fixed slots', () => {
    expect(parseCreature('X\nHealth: 20', 'cypher').stats[0]).toMatchObject({ slot: 'hp', value: '20' })
    expect(parseCreature('X\nAC: 15', '5e').stats[0]).toMatchObject({ slot: 'armor', value: '15' })
  })

  it('shortens Nimble armor and drops "None"', () => {
    expect(parseCreature('X\nArmor: Heavy', 'nimble').stats[0].value).toBe('H')
    expect(parseCreature('X\nArmor: None | HP: 49', 'nimble').stats.map((s) => s.slot)).toEqual(['hp'])
    expect(parseCreature('X\nArmor: Heavy', 'cypher').stats[0].value).toBe('Heavy')
  })

  it('accepts bold stat keys and a bold or italic header', () => {
    const m = parseCreature('**Frost Wisp**\n*Level 2*\n**HP:** 6 | **Armor:** 0')
    expect(m.name).toBe('Frost Wisp')
    expect(m.subtitle).toBe('Level 2')
    expect(m.stats.map((s) => s.value)).toEqual(['0', '6'])
  })

  it('works with no stats or body', () => {
    const m = parseCreature('Sunblade Duelist\nCustom, scale to party')
    expect(m.stats).toEqual([])
    expect(m.body).toBe('')
  })
})

describe('renderCreature', () => {
  const html = renderCreature(FLORINDRIS, 'creature nimble')

  it('renders ribbons, one line per source line', () => {
    expect(html).toMatch(/<div class="creature-ribbon"><p><strong>Aura of Wind\.<\/strong>[^<]*<\/p><p><strong>Wither\.<\/strong>/)
  })

  it('marks Bloodied and Last Stand lines', () => {
    expect(html.match(/class="creature-phase"/g)).toHaveLength(2)
  })

  it('renders actions as a list and dividers as rules', () => {
    expect(html).toContain('<li><strong>Gust.</strong>')
    expect(html.match(/creature-rule/g)).toHaveLength(2)
  })
})

describe('parseDoc creature fences', () => {
  it('renders ```creature as a card and leaves other code blocks alone', () => {
    const { html } = parseDoc('```creature cypher\nFrost Wisp\nHealth: 6\n```\n\n```js\nlet x\n```', 's')
    expect(html).toContain('<section class="creature"')
    expect(html).toContain('<code class="language-js">')
  })

  it('renders cards nested in list items', () => {
    const { html } = parseDoc('- **Combatants**\n\n  ```creature\n  Goblin\n  ```\n', 's')
    expect(html).toContain('<p class="creature-name">Goblin</p>')
  })
})
