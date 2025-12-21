import { Link } from 'react-router-dom'

interface MonsterNavigationProps {
  onRandomMonster: () => void
  searchComponent: React.ReactNode
  showFilters: boolean
  setShowFilters: (value: boolean) => void
  activeFilters: boolean
  showIndex: boolean
  setShowIndex: (value: boolean) => void
}

const MonsterNavigation = ({
  onRandomMonster,
  searchComponent,
  showFilters,
  setShowFilters,
  activeFilters,
  showIndex,
  setShowIndex
}: MonsterNavigationProps) => {
  return (
    <nav className="bg-black/60 backdrop-blur-md border-b-2 border-red-600/50 p-4 sticky top-0 z-10 shadow-lg shadow-red-900/50">
      <div className="max-w-6xl mx-auto flex items-center gap-4 flex-wrap">
        <Link 
          to="/"
          className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded border-2 border-amber-600/50 transition-all duration-200 shadow-lg hover:shadow-amber-500/30 font-serif tracking-wide"
        >
          🏕️ Home
        </Link>
        <button 
          onClick={onRandomMonster} 
          className="bg-red-700 hover:bg-red-600 text-amber-100 font-bold py-2 px-6 rounded border-2 border-amber-600/50 transition-all duration-200 shadow-lg hover:shadow-amber-500/30 font-serif tracking-wide"
        >
          🎲 Generate
        </button>
        
        {searchComponent}

        <button
          onClick={() => setShowFilters(!showFilters)}
          data-filter-button
          className={`${activeFilters ? 'bg-amber-700' : 'bg-slate-700'} hover:bg-amber-600 text-amber-100 font-bold py-2 px-6 rounded border-2 border-amber-600/50 transition-all duration-200 shadow-lg hover:shadow-amber-500/30 font-serif tracking-wide`}
        >
          🎯 Filter {activeFilters && '(Active)'}
        </button>

        <button
          onClick={() => setShowIndex(!showIndex)}
          data-index-button
          className="bg-slate-700 hover:bg-amber-600 text-amber-100 font-bold py-2 px-6 rounded border-2 border-amber-600/50 transition-all duration-200 shadow-lg hover:shadow-amber-500/30 font-serif tracking-wide"
        >
          📚 Index
        </button>
      </div>
    </nav>
  )
}
export default MonsterNavigation