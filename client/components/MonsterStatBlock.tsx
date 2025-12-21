import { MonsterDetails } from "../Types/MonsterModel"

interface MonsterStatBlockProps {
  monsterDetails: MonsterDetails
  randomQuote: string
}

const MonsterStatBlock = ({ monsterDetails, randomQuote }: MonsterStatBlockProps) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-800 rounded-lg p-8 shadow-2xl relative">
      {/* Decorative corners */}
      <div className="absolute top-2 left-2 text-amber-800 text-2xl">╔</div>
      <div className="absolute top-2 right-2 text-amber-800 text-2xl">╗</div>
      <div className="absolute bottom-2 left-2 text-amber-800 text-2xl">╚</div>
      <div className="absolute bottom-2 right-2 text-amber-800 text-2xl">╝</div>

      {/* Monster Header */}
      <div className="border-b-2 border-amber-800 pb-6 mb-6">
        <h2 className="text-4xl font-bold text-red-900 mb-2 font-serif text-center tracking-wide">
          {monsterDetails.name.toUpperCase()}
        </h2>
        <p className="text-center text-amber-900 italic font-serif mb-4">
          {monsterDetails.size} {monsterDetails.type}, {monsterDetails.alignment}
        </p>
        
        {monsterDetails.image && (
          <div className="mt-6 flex justify-center border-t-2 border-amber-800 pt-6">
            <img 
              src={`https://www.dnd5eapi.co${monsterDetails.image}`} 
              alt={monsterDetails.name}
              className="rounded border-4 border-amber-800 shadow-2xl max-w-md w-full sepia-[0.2]"
            />
          </div>
        )}
        
        <div className="border-2 border-amber-700 bg-amber-50 rounded p-4 mt-4">
          <div className="grid grid-cols-2 gap-3 text-amber-950 font-serif text-sm">
            <div>
              <span className="font-bold">Challenge Rating:</span> {monsterDetails.challenge_rating} ⚔️
            </div>
            <div>
              <span className="font-bold">Experience Points:</span> {monsterDetails.xp?.toLocaleString() || 'Unknown'} XP
            </div>
          </div>
        </div>
      </div>

      {/* Combat Stats */}
      <div className="mb-6 bg-red-50 border-2 border-red-800 rounded p-4">
        <div className="grid grid-cols-3 gap-4 font-serif">
          <div>
            <span className="text-red-900 font-bold">Armor Class:</span>
            <span className="text-red-950 text-xl ml-2 font-bold">{monsterDetails.armor_class[0]?.value}</span>
            <span className="text-red-800 text-sm ml-1">
              ({monsterDetails.armor_class[0]?.type || 'natural armor'})
            </span>
          </div>
          <div>
            <span className="text-red-900 font-bold">Hit Points:</span>
            <span className="text-red-950 text-xl ml-2 font-bold">{monsterDetails.hit_points}</span>
            <span className="text-red-800 text-sm ml-1">
              ({monsterDetails.hit_dice})
            </span>
          </div>
          <div>
            <span className="text-red-900 font-bold">Speed:</span>
            <span className="text-red-950 text-sm ml-2">
              {Object.entries(monsterDetails.speed).map(([type, value]) => `${type} ${value}`).join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="mb-6 border-t-2 border-b-2 border-amber-800 py-4">
        <div className="grid grid-cols-6 gap-2">
          {[
            { label: 'STR', value: monsterDetails.strength },
            { label: 'DEX', value: monsterDetails.dexterity },
            { label: 'CON', value: monsterDetails.constitution },
            { label: 'INT', value: monsterDetails.intelligence },
            { label: 'WIS', value: monsterDetails.wisdom },
            { label: 'CHA', value: monsterDetails.charisma }
          ].map(stat => {
            const modifier = Math.floor((stat.value - 10) / 2)
            const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`
            return (
              <div key={stat.label} className="bg-amber-100 border-2 border-amber-900 rounded text-center p-2">
                <div className="text-amber-900 font-bold text-xs font-serif">{stat.label}</div>
                <div className="text-amber-950 text-2xl font-bold">{stat.value}</div>
                <div className="text-amber-800 text-sm">({modifierStr})</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Proficiencies */}
      {monsterDetails.proficiencies && monsterDetails.proficiencies.length > 0 && (
        <div className="mb-4 font-serif text-sm text-amber-950">
          <span className="font-bold">Proficiencies:</span> {monsterDetails.proficiencies.map(p => p.proficiency.name).join(', ')}
        </div>
      )}

      {/* Damage Resistances/Immunities */}
      {(monsterDetails.damage_resistances?.length > 0 || monsterDetails.damage_immunities?.length > 0) && (
        <div className="mb-4 font-serif text-sm">
          {monsterDetails.damage_resistances?.length > 0 && (
            <div className="text-amber-950">
              <span className="font-bold">Damage Resistances:</span> {monsterDetails.damage_resistances.join(', ')}
            </div>
          )}
          {monsterDetails.damage_immunities?.length > 0 && (
            <div className="text-amber-950">
              <span className="font-bold">Damage Immunities:</span> {monsterDetails.damage_immunities.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Languages */}
      <div className="mb-6 font-serif text-sm text-amber-950">
        <span className="font-bold">Languages:</span> {monsterDetails.languages || '—'}
      </div>

      {/* Special Abilities */}
      {monsterDetails.special_abilities && monsterDetails.special_abilities.length > 0 && (
        <div className="mb-6 border-t-2 border-amber-800 pt-4">
          <h3 className="text-xl font-bold text-red-900 mb-3 font-serif">✨ Special Abilities</h3>
          <div className="space-y-3">
            {monsterDetails.special_abilities.map((ability, index) => (
              <div key={index} className="bg-amber-50 border border-amber-700 rounded p-3">
                <p className="font-bold text-red-900 font-serif italic mb-1">⚡ {ability.name}</p>
                <p className="text-amber-950 text-sm font-serif leading-relaxed">{ability.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {monsterDetails.actions && monsterDetails.actions.length > 0 && (
        <div className="mb-6 border-t-2 border-amber-800 pt-4">
          <h3 className="text-xl font-bold text-red-900 mb-3 font-serif">⚔️ Actions</h3>
          <div className="space-y-3">
            {monsterDetails.actions.map((action, index) => (
              <div key={index} className="bg-amber-50 border border-amber-700 rounded p-3">
                <p className="font-bold text-red-900 font-serif italic mb-1">🗡️ {action.name}</p>
                <p className="text-amber-950 text-sm font-serif leading-relaxed">{action.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legendary Actions */}
      {monsterDetails.legendary_actions && monsterDetails.legendary_actions.length > 0 && (
        <div className="mb-6 border-t-2 border-amber-800 pt-4">
          <h3 className="text-xl font-bold text-red-900 mb-3 font-serif">👑 Legendary Actions</h3>
          <div className="space-y-3">
            {monsterDetails.legendary_actions.map((action, index) => (
              <div key={index} className="bg-amber-50 border border-amber-700 rounded p-3">
                <p className="font-bold text-red-900 font-serif italic mb-1">✨ {action.name}</p>
                <p className="text-amber-950 text-sm font-serif leading-relaxed">{action.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lore footer */}
      <div className="mt-6 text-center text-amber-800 text-xs font-serif italic border-t border-amber-700 pt-4">
        {randomQuote}
      </div>
    </div>
  )
}
export default MonsterStatBlock