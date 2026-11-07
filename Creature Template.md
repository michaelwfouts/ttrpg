# Creature Template

Reference for the `creature` stat card blocks used in `content/`. Copy the blank template, fill it in, and delete any parts you don't need. Every part except the name is optional.

## Blank template

```creature <system>
<Name>
<Subtitle, e.g. Level 5 Large Beast>
HP: <n> | Armor: <value> | Speed: <value> | Saves: <value>

*<Optional one-sentence description.>*

> **<Trait>.** <Passive effect.>

- **<Action>.** <Effect.>
- **<Action>.** <Effect.>

> **<Condition>.** <What the condition does.>

---

**BLOODIED:** At **<n> HP**, <what changes>.
**LAST STAND:** <Name> is dying! **<n>** more damage and it dies. <What changes.>
```

## Every feature in one card

```creature nimble
Florindris, Bane of the Forest
Level 7 Solo Large Floral Dragon
HP: 200 | Armor: Medium | Saves: ALL+ | Speed: Fly 10
Size: Large

*An ancient dragon of thorn and blossom that guards the old wood.*

> **Aura of Wind.** Ranged attacks against you have disadvantage.
> **Wither.** Resistant to necrotic damage, but it suppresses Aura of Wind for 1 turn.

> **Second Ribbon.** A blank line between `>` lines starts a separate ribbon.

---

**ACTIONS:** After each hero's turn, choose one:
- **Petal Storm.** (1 use) 3d10+10 damage to all enemies within Reach 8, half on a DC 13 DEX save.
- **Rend.** (Reach 2) 1d10+10 damage to up to 2 targets. On hit: Thornblight. OR:
- **Gust.** (Reach 8) Move a target 1d10 spaces.
  - Sub-bullets work for short lists.

> **Thornblight.** Suffer 5 damage for each space you are forcibly moved. Magical healing ends this effect.

---

**BLOODIED:** At **100 HP**, enemies within Reach 12 gain Thornblight, and Petal Storm recharges.
**LAST STAND:** Florindris is dying! **70** more damage and she dies.
```

## The header

The header is everything before the first blank line.

| Line | What it does |
|---|---|
| First line | The creature's name. Plain text; `**bold**` or a `#` is stripped. Don't make it a real heading. |
| Any line that isn't stats | The subtitle (small caps under the name). Several such lines are joined into one. |
| `Key: value \| Key: value` | Stat pills on the right. Several stat lines are allowed. `**HP:** 27` (bold keys) also works. |
| No stat line | Fine. The card just has no pills (e.g. "Custom, scale to party"). |

### Stat slots

These four always appear in the same order, ending with **HP in the top-right corner**. Any of the listed names works, in any order and any capitalization.

| Slot | Icon | Accepted names |
|---|---|---|
| Saves | star | `Saves`, `Saving Throws` |
| Speed | arrow | `Speed`, `Movement`, `Move` |
| Armor | shield | `Armor`, `AC`, `Armor Class` |
| HP | heart | `HP`, `Health`, `Hit Points` |

Any other key (`Size`, `Damage`, `CR`, `Effort`, ...) becomes a small labeled pill to the left of the slots. Keep these values to a word or two.

### System name

The word after `creature` on the opening line names the system: `creature nimble`, `creature cypher`, `creature 5e`, or just `creature`.

| System | Effect |
|---|---|
| `nimble` | Armor `Light` / `Medium` / `Heavy` shows as `L` / `M` / `H`. `Armor: None` is hidden. |
| anything else | Values are shown exactly as written. |

## The body

The body is everything after the first blank line. Bold, italics and links work anywhere.

| Write | Shows as | Use for |
|---|---|---|
| `> **Name.** text` | Grey ribbon with pointed ends | Passive traits, auras, immunities, conditions it inflicts |
| `>` lines with no blank line between | One ribbon, one line each | Grouping related passives |
| `- **Name.** text` | Bullet | Actions and attacks |
| `  - text` (indented 2 spaces) | Sub-bullet | Short lists under an action |
| `1. text` | Numbered list | Ordered steps, if ever needed |
| `---` | Thin divider | Splitting traits / actions / phases |
| A plain line | Its own line | Labels like `**ACTIONS:** After each hero's turn, choose one:` |
| `*text*` on its own line | Italic line | A one-sentence description |
| `**BLOODIED:** ...` or `**LAST STAND:** ...` | Phase line; later **bold** text turns red | Boss phase changes. Bold the trigger number. |

## Per-system starting points

```creature cypher
<Name>
Level <n>
Health: <n> | Armor: <n> | Movement: <Immediate/Short/Long>

> **<Modification or special rule>.** <Effect.>

- **Damage.** <n> points (<how it hits>).
- **<Ability>.** <Effect, with Difficulty.>
```

**Combat.** How it fights. **Interaction.** How it talks. **GM Intrusion (Name):** These stay as paragraphs under the card.

```creature 5e
<Name>
<Size type>, CR <n>
AC: <n> | HP: <n> | Speed: <n> ft.

> **<Trait>.** <Passive effect.>

- **Multiattack.** Makes two <Attack> attacks.
- **<Attack>.** +<n> to hit, reach 5 ft. <dice> <type> damage.
- **<Breath Weapon> (Recharge 5-6).** <Effect, DC n save.>
- **<Reaction Name> (Reaction).** <Trigger and effect.>

---

**LEGENDARY ACTIONS (3/round):** Recharge at the start of its turn.
- **<Legendary Action>.** <Effect.>
```

## Creature index

An empty `creature-index` block is replaced by every creature card in the same file, in page order. Each card has a small "From: <section>" line under it naming the heading it sits under. Use it for an end-of-module reference instead of copying cards by hand; edits to a card show up in both places.

```creature-index
```

- It can go anywhere in the file, even before the cards it collects.
- Cards nested inside bullet lists are included too.
- In a file with no creature cards it shows nothing.

## Gotchas

- **The first blank line ends the header.** Don't leave a blank line between the name, subtitle, and stats.
- **A subtitle that looks like `Word: text` is read as a stat.** Write `Custom, scale to party`, not `Custom: scale to party`.
- **One ability per line.** Each line in the source is its own line on the card, so don't wrap a long ability onto a second line.
- **Always close the block** with ```` ``` ````. An unclosed block swallows the rest of the page.
- **Put cards outside bullet lists** so they get the full page width. They still work inside a list item, just indented.
- **One card per creature type**, not per group. Put counts in the subtitle or the text ("use 2-4").
