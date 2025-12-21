import {  useRef, useEffect } from 'react'
import { MonsterDetails } from '../Types/MonsterModel.ts'

interface MonsterSearchDropdownProps {
  search: string
  setSearch: (value: string) => void
  filteredMonsters: MonsterDetails[] | undefined
  onSelectMonster: (monster: MonsterDetails) => void
}

const MonsterSearchDropdown = ({ search, setSearch, filteredMonsters, onSelectMonster }: MonsterSearchDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setSearch])

  return (
    <div className="relative flex-1 max-w-md" ref={dropdownRef}>
      <input 
        type="text"
        placeholder="🔍 Scry for creatures..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search for monsters"
        className="w-full bg-black/70 border-2 border-amber-700/60 rounded px-4 py-2 text-amber-100 placeholder-amber-700/60 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-600/40 font-serif"
      />
      
      {search && filteredMonsters && filteredMonsters.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-black/95 border-2 border-amber-700/60 rounded max-h-60 overflow-y-auto shadow-2xl shadow-red-900/50 z-20">
          {filteredMonsters.map((monster) => (
            <div 
              key={monster.index}
              onClick={() => onSelectMonster(monster)}
              className="p-3 hover:bg-red-900/40 cursor-pointer border-b border-amber-900/30 last:border-b-0 text-amber-100 transition-colors font-serif flex justify-between items-center"
            >
              <span>⚔️ {monster.name}</span>
              <span className="text-xs text-amber-600">CR {monster.challenge_rating}</span>
            </div>
          ))}
        </div>
      )}

      {search && filteredMonsters && filteredMonsters.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-black/95 border-2 border-amber-700/60 rounded p-4 text-amber-700 text-center font-serif italic z-20">
          No beasts match thy query...
        </div>
      )}
    </div>
  )
}
export default MonsterSearchDropdown