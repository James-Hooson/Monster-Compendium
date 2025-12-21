import React from 'react'
import { MonsterDetails } from '../Types/MonsterModel.ts'

interface MonsterFiltersProps {
  showFilters: boolean
  minCR: string
  setMinCR: (value: string) => void
  maxCR: string
  setMaxCR: (value: string) => void
  selectedType: string
  setSelectedType: (value: string) => void
  selectedSize: string
  setSelectedSize: (value: string) => void
  selectedAlignment: string
  setSelectedAlignment: (value: string) => void
  clearFilters: () => void
  filteredMonsters: MonsterDetails[] | undefined
  allMonsterDetails: MonsterDetails[] | undefined
  onSelectMonster: (monster: MonsterDetails) => void
  filterRef: React.RefObject<HTMLDivElement>
}

const MonsterFilters = ({
  showFilters,
  minCR,
  setMinCR,
  maxCR,
  setMaxCR,
  selectedType,
  setSelectedType,
  selectedSize,
  setSelectedSize,
  selectedAlignment,
  setSelectedAlignment,
  clearFilters,
  filteredMonsters,
  allMonsterDetails,
  onSelectMonster,
  filterRef
}: MonsterFiltersProps) => {
  if (!showFilters) return null

  const uniqueTypes = Array.from(new Set(allMonsterDetails?.map(m => m.type) || [])).sort()
  const uniqueSizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']
  const uniqueAlignments = [
    'lawful good', 'neutral good', 'chaotic good',
    'lawful neutral', 'neutral', 'chaotic neutral', 
    'lawful evil', 'neutral evil', 'chaotic evil',
    'unaligned', 'any alignment'
  ]

  const activeFilters = minCR !== '' || maxCR !== '' || selectedType !== '' || selectedSize !== '' || selectedAlignment !== ''

  return (
    <div ref={filterRef} className="max-w-6xl mx-auto mt-4 bg-black/80 border-2 border-amber-700/60 rounded p-4">
      <h3 className="text-amber-400 font-serif font-bold mb-4">Advanced Filters</h3>
      
      {/* Challenge Rating */}
      <div className="mb-4 pb-4 border-b border-amber-700/40">
        <h4 className="text-amber-300 font-serif text-sm mb-2">Challenge Rating</h4>
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-amber-100 font-serif text-sm">Min:</label>
            <input
              type="number"
              value={minCR}
              onChange={(e) => setMinCR(e.target.value)}
              placeholder="0"
              min="0"
              max="30"
              step="0.125"
              className="w-24 bg-black/70 border-2 border-amber-700/60 rounded px-3 py-1 text-amber-100 focus:outline-none focus:border-amber-500 font-serif"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-amber-100 font-serif text-sm">Max:</label>
            <input
              type="number"
              value={maxCR}
              onChange={(e) => setMaxCR(e.target.value)}
              placeholder="30"
              min="0"
              max="30"
              step="0.125"
              className="w-24 bg-black/70 border-2 border-amber-700/60 rounded px-3 py-1 text-amber-100 focus:outline-none focus:border-amber-500 font-serif"
            />
          </div>
          <div className="text-amber-700 font-serif text-xs italic">
            💡 Common CRs: 0.125 (1/8), 0.25 (1/4), 0.5 (1/2), 1-30
          </div>
        </div>
      </div>

      {/* Type, Size, Alignment */}
      <div className="mb-4 pb-4 border-b border-amber-700/40">
        <h4 className="text-amber-300 font-serif text-sm mb-2">Creature Properties</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-amber-100 font-serif text-sm block mb-1">Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-black/70 border-2 border-amber-700/60 rounded px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-500 font-serif text-sm"
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-amber-100 font-serif text-sm block mb-1">Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-black/70 border-2 border-amber-700/60 rounded px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-500 font-serif text-sm"
            >
              <option value="">All Sizes</option>
              {uniqueSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-amber-100 font-serif text-sm block mb-1">Alignment:</label>
            <select
              value={selectedAlignment}
              onChange={(e) => setSelectedAlignment(e.target.value)}
              className="w-full bg-black/70 border-2 border-amber-700/60 rounded px-3 py-2 text-amber-100 focus:outline-none focus:border-amber-500 font-serif text-sm"
            >
              <option value="">All Alignments</option>
              {uniqueAlignments.map(alignment => (
                <option key={alignment} value={alignment}>
                  {alignment.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clear and Results */}
      <div className="flex gap-4 items-center flex-wrap justify-between">
        <button
          onClick={clearFilters}
          className="bg-red-700/50 hover:bg-red-700 text-amber-100 font-serif text-sm py-2 px-6 rounded border border-amber-700/50 transition-all"
        >
          Clear All Filters
        </button>
        <div className="text-amber-600 font-serif text-sm">
          {filteredMonsters?.length || 0} creature{filteredMonsters?.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Filtered Creatures List */}
      {activeFilters && filteredMonsters && filteredMonsters.length > 0 && (
        <div className="mt-4 border-t border-amber-700/60 pt-4">
          <h4 className="text-amber-400 font-serif font-bold mb-2 text-sm">Filtered Creatures:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {filteredMonsters.map((monster) => (
              <div
                key={monster.index}
                onClick={() => onSelectMonster(monster)}
                className="bg-black/60 border border-amber-700/40 rounded p-2 hover:bg-red-900/40 cursor-pointer transition-colors"
              >
                <div className="text-amber-100 font-serif text-sm truncate">
                  ⚔️ {monster.name}
                </div>
                <div className="text-amber-600 font-serif text-xs">
                  CR {monster.challenge_rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export default MonsterFilters