interface Monster {
  index: string
  name: string
  url: string
}

interface MonsterDetails {
  index: string
  name: string
  size: string
  type: string
  alignment: string
  challenge_rating: number
  xp?: number
  armor_class: Array<{ value: number; type?: string }>
  hit_points: number
  hit_dice: string
  speed: Record<string, string>
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  proficiencies?: Array<{ proficiency: { name: string }; value: number }>
  damage_resistances?: string[]
  damage_immunities?: string[]
  languages?: string
  special_abilities?: Array<{ name: string; desc: string }>
  actions?: Array<{ name: string; desc: string }>
  legendary_actions?: Array<{ name: string; desc: string }>
  image?: string
}

export type { Monster, MonsterDetails }