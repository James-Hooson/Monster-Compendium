import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import MonsterNavigation from './MonsterNavigation'
import MonsterSearchDropdown from './MonsterSearchDropdown'
import MonsterFilters from './MonsterFilters'
import MonsterIndex from './MonsterIndex'
import MonsterStatBlock from './MonsterStatBlock'
import useMonsterData from './hooks/useMonsterData'
import { getMonsterDetails } from '../apiClient'
import { MonsterDetails, Monster } from '../Types/MonsterModel.ts'  

const MonsterCompendium = () => {
  const quotes =[
    "“The world is indeed full of peril, and in it there are many dark places; but still there is much that is fair, and though in all lands love is now mingled with grief, it grows perhaps the greater.” ― J.R.R. Tolkien",
    "“Monsters are real, and ghosts are real too. They live inside us, and sometimes, they win.” ― Stephen King",
    "“Do not be afraid of the monsters, for they are but shadows of your own fears.” ― Unknown",
    "“The only thing we have to fear is fear itself.” ― Franklin D. Roosevelt",
    "“Courage is resistance to fear, mastery of fear, not absence of fear.” ― Mark Twain",
    "“In the midst of chaos, there is also opportunity.” ― Sun Tzu",
    "“Not all those who wander are lost.” ― J.R.R. Tolkien",
    "“The greatest glory in living lies not in never falling, but in rising every time we fall.” ― Nelson Mandela"
  ]
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
  
  const [current, setCurrent] = useState<number>(0)
  const [search, setSearch] = useState<string>('')
  const [minCR, setMinCR] = useState<string>('')
  const [maxCR, setMaxCR] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedAlignment, setSelectedAlignment] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [showIndex, setShowIndex] = useState<boolean>(false)
  
  const filterRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef<HTMLDivElement>(null)

  const { monsters, allMonsterDetails, isPending, isError } = useMonsterData()

  // Filter monsters
  const filteredMonsters = allMonsterDetails?.filter(monster => {
    if (!monster) return false
    
    const nameMatch = monster.name.toLowerCase().includes(search.toLowerCase())
    
    const min = minCR === '' ? -Infinity : parseFloat(minCR)
    const max = maxCR === '' ? Infinity : parseFloat(maxCR)
    const monsterCR = monster.challenge_rating
    const crMatch = monsterCR >= min && monsterCR <= max
    
    const typeMatch = selectedType === '' || monster.type.toLowerCase() === selectedType.toLowerCase()
    const sizeMatch = selectedSize === '' || monster.size.toLowerCase() === selectedSize.toLowerCase()
    const alignmentMatch = selectedAlignment === '' || monster.alignment.toLowerCase().includes(selectedAlignment.toLowerCase())
    
    return nameMatch && crMatch && typeMatch && sizeMatch && alignmentMatch
  })

  const selectMonsterByDetails = (monsterDetail: MonsterDetails) => {
    const index = monsters?.findIndex((m: Monster) => m.index === monsterDetail.index) ?? 0
    selectMonster(index)
  }

  const selectMonster = (index: number) => {
    if (monsters && index >= 0 && index < monsters.length) {
      setCurrent(index)
      setSearch('')
    }
  }

  const RandomMonster = () => {
    if (filteredMonsters && filteredMonsters.length > 0) {
      const random = Math.floor(Math.random() * filteredMonsters.length)
      selectMonsterByDetails(filteredMonsters[random])
    } else if (monsters && monsters.length > 0) {
      const random = Math.floor(Math.random() * monsters.length)
      setCurrent(random)
    }
  }

  const clearFilters = () => {
    setMinCR('')
    setMaxCR('')
    setSelectedType('')
    setSelectedSize('')
    setSelectedAlignment('')
  }

  const activeFilters = minCR !== '' || maxCR !== '' || selectedType !== '' || selectedSize !== '' || selectedAlignment !== ''

  const selectedMonster = monsters?.[current]?.index
  
  const { data: monsterDetails, isLoading, isError: isDetailsError } = useQuery({
    queryKey: ['monster', selectedMonster],
    queryFn: () => getMonsterDetails(selectedMonster!),
    enabled: !!selectedMonster,
    retry: 2
  })

  // Close panels on click outside or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        const filterButton = document.querySelector('[data-filter-button]')
        if (filterButton && !filterButton.contains(event.target as Node)) {
          setShowFilters(false)
        }
      }
      if (indexRef.current && !indexRef.current.contains(event.target as Node)) {
        const indexButton = document.querySelector('[data-index-button]')
        if (indexButton && !indexButton.contains(event.target as Node)) {
          setShowIndex(false)
        }
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearch('')
        setShowFilters(false)
        setShowIndex(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  if (isPending) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-black flex items-center justify-center">
      <div className="text-amber-400 text-2xl font-serif animate-pulse">⏳ Loading bestiary...</div>
    </div>
  )
  
  if (isError) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-black flex items-center justify-center">
      <div className="text-red-400 text-2xl font-serif">⚠️ Error loading monsters</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-black">
      <MonsterNavigation
        onRandomMonster={RandomMonster}
        searchComponent={
          <MonsterSearchDropdown
            search={search}
            setSearch={setSearch}
            filteredMonsters={filteredMonsters}
            onSelectMonster={selectMonsterByDetails}
          />
        }
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeFilters={activeFilters}
        showIndex={showIndex}
        setShowIndex={setShowIndex}
      />

      <MonsterFilters
        showFilters={showFilters}
        minCR={minCR}
        setMinCR={setMinCR}
        maxCR={maxCR}
        setMaxCR={setMaxCR}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedAlignment={selectedAlignment}
        setSelectedAlignment={setSelectedAlignment}
clearFilters={clearFilters}
        filteredMonsters={filteredMonsters}
        allMonsterDetails={allMonsterDetails}
        onSelectMonster={selectMonsterByDetails}
        filterRef={filterRef}
      />

      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-5xl font-bold text-center text-amber-400 mb-2 drop-shadow-2xl font-serif tracking-wider">
          📜 MONSTER COMPENDIUM 📜
        </h1>
        <p className="text-center text-amber-700 font-serif italic mb-8">
          A Gentleman and a Scholar's Guide to the Beasts of the Realm
        </p>

        <MonsterIndex
          showIndex={showIndex}
          allMonsterDetails={allMonsterDetails}
          onSelectMonster={selectMonsterByDetails}
          onClose={() => setShowIndex(false)}
          indexRef={indexRef}
        />

        {isLoading && (
          <div className="text-center text-amber-400 text-xl py-12 font-serif animate-pulse">
            ⏳ Consulting ancient tomes...
          </div>
        )}
        
        {isDetailsError && (
          <div className="bg-red-950/50 border-2 border-red-700 rounded-lg p-4 text-red-400 text-center font-serif">
            ⚠️ The arcane connection has been severed!
          </div>
        )}

        {monsterDetails && (
          <MonsterStatBlock monsterDetails={monsterDetails} randomQuote={randomQuote} />
        )}
      </main>
    </div>
  )
}

export default MonsterCompendium