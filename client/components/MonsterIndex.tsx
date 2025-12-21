import React from 'react'
import { MonsterDetails } from '../Types/MonsterModel.ts'

interface MonsterIndexProps {
  showIndex: boolean
  allMonsterDetails: MonsterDetails[] | undefined
  onSelectMonster: (monster: MonsterDetails) => void
  onClose: () => void
  indexRef: React.RefObject<HTMLDivElement>
}

const MonsterIndex = ({ showIndex, allMonsterDetails, onSelectMonster, onClose, indexRef }: MonsterIndexProps) => {
  if (!showIndex || !allMonsterDetails) return null

  return (
    <div ref={indexRef} className="mb-8 bg-gradient-to-br from-black/80 to-black/60 border-2 border-amber-700/60 rounded-lg p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-amber-400 font-serif">Complete Monster Index</h2>
        <button
          onClick={onClose}
          className="text-amber-600 hover:text-amber-400 font-serif text-sm"
        >
          ✕ Close
        </button>
      </div>
      
      <div className="mb-4 text-amber-600 font-serif text-sm">
        {allMonsterDetails.length} creatures catalogued
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto pr-2">
        {allMonsterDetails
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((monster) => (
            <div
              key={monster.index}
              onClick={() => {
                onSelectMonster(monster)
                onClose()
              }}
              className="bg-black/60 border border-amber-700/40 rounded p-3 hover:bg-red-900/40 cursor-pointer transition-all hover:border-amber-500 hover:shadow-lg hover:shadow-amber-900/20"
            >
              <div className="text-amber-100 font-serif text-sm font-bold mb-1">
                ⚔️ {monster.name}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-600 font-serif">
                  CR {monster.challenge_rating}
                </span>
                <span className="text-amber-700 font-serif italic">
                  {monster.size}
                </span>
              </div>
              <div className="text-amber-700 font-serif text-xs mt-1 truncate">
                {monster.type}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default MonsterIndex