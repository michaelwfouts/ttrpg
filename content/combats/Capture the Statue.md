---
title: Capture the Statue
tags: [encounter, coliseum-oneshot, combat]
system: D&D 5e
---

## Encounter Overview

### Encounter Hook
Haul more corporate-sponsored golden statues into your territory than the rival team before the 30-second buzzer, while every advertisement in the arena turns into a hazard around you.

### Setup/Context
The bout is staged in the Coliseum of Port Nyanzaru, a venue run by an ultra-capitalist crowd that monetizes everything, including the traps. The statues, the lighting, and the mid-match "complications" are all sponsored ad gimmicks the crowd expects to see, so nothing that happens on the floor is ever purely cosmetic; it's also a commercial. Two teams compete for bragging rights, sponsor prizes, and crowd favor rather than each other's lives. A win earns the party a sponsor's backing in the city; a loss leaves them a punchline in the vendors' sales pitches for the rest of the week. As soon as the party walks out, the announcer calls the opposing team's entrance so both sides get their first look at each other before the horn sounds.

### Intro

  > You step out onto the sun-bleached sand of the Coliseum floor into a wall of noise: drums, horns, and an announcer's voice booming your team name over the crowd. The air is thick with sweat, spilled wine, and the smoke of a hundred vendors roasting spiced nuts in the stands. Five golden statues gleam in the center of the arena, each etched with a different merchant house's crest, and enormous banners snap overhead advertising everything from spiced wine to enchanted sandals.

### Key Features
- **Arena layout** - The floor is open, packed sand divided into 4 quadrants by painted lines, with a neutral center ring that belongs to no quadrant. Each team's home territory is the two quadrants on opposite sides of the arena.
- **Statues** - All 5 statues begin in the neutral center ring. No more than two statues can rest in a single quadrant at once, so a team going for a 3-statue lead must hold statues in both of its home quadrants, making a lead harder to simply turtle and defend.
- **Moving a statue** - Picking up a statue uses a creature's Interact with an Object action, and dropping one costs nothing. A creature carrying a statue has its speed halved. A creature can instead make a Strength check as a bonus action; on a success it moves at full speed while carrying the statue that turn.
- **Advertisement hazards** - At the end of round, the announcer reads the next sponsor's "bit" and its fixtures visibly power up. The hazard goes live at the start of the following round and lasts until the end of that round. Use each hazard once, in any order:

  | Hazard | Effect | Announcer Callout |
  |---|---|---|
  | Freezer advertisement | The frosted statues become slippery; any creature that ends its turn adjacent to one must succeed on a Dexterity save or fall prone | "Feeling the heat out there, folks? Frostbyte Ale is here to cool things down... in about sixty seconds!" The statues visibly begin frosting over with condensation as the crowd cheers. |
  | Rave advertisement | Each statue base blares music and strobes disco lights; any creature within 5 feet of a statue must make a Wisdom save or have its speed halved and make attack rolls at disadvantage until the start of its next turn, and other creatures have advantage on attack rolls against it | "Time to turn it UP! Midnight Elixir presents... the after-party!" House music swells and the lights along the statue bases begin to flicker to life in warning. |
  | Sandstorm cologne advertisement | A thick, perfumed haze billows out from vents in the statues.  The area within a 10 ft radius of each becomes heavily obscured, and any creature that starts its turn inside must succeed on a Constitution save or be blinded until the start of its next turn | "Smell like a champion! Dune Storm cologne, now with 100% more atmosphere!" Vents along the quadrant walls hiss and rattle as pressure builds inside them. |
  | Energy tonic advertisement | Crackling arcs of lightning leap between the statue bases; any creature that ends its turn within 10 feet of a statue must succeed on a Dexterity save or be pushed 10 feet toward the nearest quadrant boundary and take thunder damage | "Feel the SURGE! Voltbrew Energy Tonic, official sponsor of tonight's main event!" Sparks begin to dance visibly along the statues' bases as the crowd chants along. |

- **Knockouts** - A creature reduced to 0 hit points is knocked unconscious rather than killed, and arena medics drag it off the floor at the end of the round. Any statue it was carrying drops in its space.
- **The buzzer** - At the end of round 5, the team with the most statues resting in its own home territory wins the bout. A team that has no conscious combatants on the floor before then forfeits immediately, and the other team wins regardless of the statue count.

## Encounter Details

*(Battle map image to be inserted here.)*

### Combatants

```creature 5e
Sunblade Duelist
Health: 50 | Armor: 18 | Movement: 30

*The team's front-line showman, a flashy blade-for-hire who treats every clash like it's the main event.*

> **Showboater.** Advantage on the first attack roll it makes each combat.

- **Multiattack.** Makes two Showboat Strike attacks.
- **Showboat Strike.** Melee weapon attack, +5 to hit, reach 5 ft. On hit: 8 (1d10+3) slashing. May additionally choose to trigger a DC 13 STR save to knock free any held statue or weapon.
- **Riposte (Reaction).** When a creature misses it with a melee attack, makes one Showboat Strike against that creature.
```

```creature 5e
Sandtrap Trickster
Health: 40 | Armor: 15 | Movement: 35

*A quick, unarmored skirmisher who treats the arena's own hazards as tools rather than threats.*

> **Hazard Sense.** Always knows which advertisement hazard is coming next and where it will hit. Advantage on saves against advertisement hazards.

- **Hooked Chain.** Melee weapon attack, +5 to hit, reach 10 ft. On hit: 10 (2d6+3) bludgeoning, and the target is pulled up to 10 feet toward the Trickster.
- **Dust Toss.** One creature within 15 feet makes a DC 13 CON save or is Blinded until the end of its next turn.
- **Vanish into the Crowd (Bonus Action).** Takes the Hide action, using the crowd along the arena's edge as cover.
```

```creature 5e
Crowd-Pleaser Battlemage
Health: 30 | Armor: 13 | Movement: 30

*A showy spellcaster who plays as much to the stands as to the fight itself.*

- **Sponsor's Bolt.** Ranged spell attack, +5 to hit, range 120 ft. On hit: 11 (2d10) lightning, crackling in the colors of the team's sponsor.
- **Spotlight Flare (Recharge 5-6).** Every creature in a 15-foot cone makes a DC 13 DEX save. On a fail: 10 (3d6) radiant and Blinded until the start of its next turn. On a success: half damage and not Blinded.
- **Encore (Bonus Action).** One ally within 30 feet gains advantage on its next saving throw before the start of the Battlemage's next turn.
- **Ad-lib Ward (Reaction).** When an ally within 30 feet is hit by an attack, reduces the damage that ally takes by 8 (1d10+3).
```

### Rewards
  - **Sponsor's Championship Sash** (party wins) - A garish silk sash bearing the sponsoring house's crest; wearing it in Port Nyanzaru grants advantage on Charisma (Persuasion) checks made to haggle with that house's merchants for the rest of the campaign.
  - **Chilled Novelty Goblet** (either outcome) - Lifted from the Frostbyte Ale promotional stand; keeps a drink ice cold for 1 hour once per day and makes a decent conversation piece.
  - **Miniature Disco Statue** (either outcome, if the party put on a good show) - A palm-sized replica of one of the arena statues that flickers with the same disco lights on command; purely cosmetic, but the crowd loves it.
  - **Banner Over the Arena** (party wins) - The winning sponsor's banner is raised over the Coliseum and vendors start hawking merchandise with the party's faces on it, making them recognizable celebrities around the city's markets.
