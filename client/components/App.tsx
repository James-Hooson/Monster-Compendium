import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMonsters, getMonsterDetails } from '../apiClient'

const App = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showIndex, setShowIndex] = useState<boolean>(false)
  const [imageError, setImageError] = useState<boolean>(false)
  const [imageLoading, setImageLoading] = useState<boolean>(true)
  
  const { data: monsters, isPending, isError } = useQuery({
    queryKey: ['monsters'],
    queryFn: getMonsters
  })

  const selectedMonster = monsters?.[currentIndex]?.index

  const { data: monsterDetails, isLoading: isLoadingDetails, isError: isDetailsError } = useQuery({
    queryKey: ['monster', selectedMonster],
    queryFn: () => getMonsterDetails(selectedMonster!),
    enabled: !!selectedMonster,
    retry: 2
  })

  const generateRandomMonster = () => {
    if (monsters && monsters.length > 0) {
      const randomIndex = Math.floor(Math.random() * monsters.length)
      setCurrentIndex(randomIndex)
      setImageError(false)
      setImageLoading(true)
    }
  }

  const goToNext = () => {
    if (monsters) {
      setCurrentIndex((currentIndex + 1) % monsters.length)
      setImageError(false)
      setImageLoading(true)
    }
  }

  const goToPrevious = () => {
    if (monsters) {
      setCurrentIndex((currentIndex - 1 + monsters.length) % monsters.length)
      setImageError(false)
      setImageLoading(true)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!monsters || !searchTerm.trim()) return

    const foundIndex = monsters.findIndex(monster => 
      monster.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (foundIndex !== -1) {
      setCurrentIndex(foundIndex)
      setSearchTerm('')
      setImageError(false)
      setImageLoading(true)
    } else {
      alert('Monster not found. Try searching by name.')
    }
  }

  const goToMonster = (index: number) => {
    setCurrentIndex(index)
    setShowIndex(false)
    setImageError(false)
    setImageLoading(true)
  }

  const getMonsterImageUrl = (details: any) => {
    if (details?.image) {
      return `https://www.dnd5eapi.co${details.image}`
    }
    return null
  }


  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const getModifier = (score: number) => {
    const mod = Math.floor((score - 10) / 2)
    return mod >= 0 ? `+${mod}` : `${mod}`
  }

  const formatSenseKey = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (isPending) return <div className="p-8 text-center">Loading monsters...</div>

  if (isError) return <div className="p-8 text-center text-red-500">Error loading monsters. Please refresh the page.</div>

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-black
       bg-white">Compendium of Monsters</h1>
      
      <div className="mt-4 flex gap-2 ">
        <button 
          onClick={generateRandomMonster}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Random
        </button>

        <button 
          onClick={() => setShowIndex(!showIndex)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          {showIndex ? 'Hide Index' : 'Show Index'}
        </button>

        <form onSubmit={handleSearch} className="flex gap-2 flex-1 ">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className=" flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Search
          </button>
        </form>
      </div>

      {showIndex && monsters && (
        <div className="mt-4 p-4 border rounded-lg bg-white max-h-96 overflow-y-auto">
          <h2 className="text-xl font-bold mb-3 sticky top-0 bg-white pb-2">Monster Index</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {monsters.map((monster, index) => (
              <button
                key={monster.index}
                onClick={() => goToMonster(index)}
                className={`text-left px-3 py-2 rounded hover:bg-blue-100 transition ${
                  index === currentIndex ? 'bg-blue-200 font-semibold' : 'bg-gray-50'
                }`}
              >
                {monster.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoadingDetails && (
        <div className="mt-6 p-8 text-center border rounded-lg bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading monster details...</p>
        </div>
      )}

      {isDetailsError && (
        <div className="mt-6 p-8 text-center border rounded-lg bg-red-50">
          <p className="text-red-600 mb-4">Failed to load monster details.</p>
          <button 
            onClick={() => goToNext()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Next Monster
          </button>
        </div>
      )}

      {monsterDetails && !isLoadingDetails && (
        <div className="mt-6 border rounded-lg bg-red-700">
          <div className="p-4 flex gap-4">
            <div className="relative w-96 h-96 flex-shrink-0">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              )}
              {(() => {
                const apiImage = getMonsterImageUrl(monsterDetails)
                return (
                  <img 
                    src={imageError || !apiImage ? (monsterDetails.name) : apiImage}
                    alt={monsterDetails.name}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                    className={`w-96 h-96 ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                  />
                )
              })()}
            </div>
            {/* Monster Name */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: '600px' }}>
              <h2 className="text-3xl font-bold text-white mb-2">{monsterDetails.name}</h2>
              <p className="text-sm text-white italic mb-4">
                {monsterDetails.size} {monsterDetails.type}, {monsterDetails.alignment}
              </p>

              {/* Basic Stats */}
              <div className="mb-4 p-3 bg-white rounded">
                <p className="mb-1">
                  <strong>Armor Class:</strong> {monsterDetails.armor_class?.[0]?.value || 'N/A'}
                </p>
                <p className="mb-1">
                  <strong>Hit Points:</strong> {monsterDetails.hit_points} ({monsterDetails.hit_points_roll || 'N/A'})
                </p>
                <p className="mb-1">
                  <strong>Speed:</strong> {monsterDetails.speed && Object.entries(monsterDetails.speed).map(([key, value]) => `${key} ${value}`).join(', ')}
                </p>
                <p>
                  <strong>Challenge Rating:</strong> {monsterDetails.challenge_rating} ({monsterDetails.xp?.toLocaleString() || 0} XP)
                </p>
              </div>

              {/* Ability Scores */}
              <div className="mb-4 p-3 bg-white rounded">
                <h3 className="font-bold mb-2">Ability Scores</h3>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-semibold">STR</div>
                    <div>{monsterDetails.strength} ({getModifier(monsterDetails.strength)})</div>
                  </div>
                  <div>
                    <div className="font-semibold">DEX</div>
                    <div>{monsterDetails.dexterity} ({getModifier(monsterDetails.dexterity)})</div>
                  </div>
                  <div>
                    <div className="font-semibold">CON</div>
                    <div>{monsterDetails.constitution} ({getModifier(monsterDetails.constitution)})</div>
                  </div>
                  <div>
                    <div className="font-semibold">INT</div>
                    <div>{monsterDetails.intelligence} ({getModifier(monsterDetails.intelligence)})</div>
                  </div>
                  <div>
                    <div className="font-semibold">WIS</div>
                    <div>{monsterDetails.wisdom} ({getModifier(monsterDetails.wisdom)})</div>
                  </div>
                  <div>
                    <div className="font-semibold">CHA</div>
                    <div>{monsterDetails.charisma} ({getModifier(monsterDetails.charisma)})</div>
                  </div>
                </div>
              </div>

              {/* Proficiencies */}
              {monsterDetails.proficiencies && monsterDetails.proficiencies.length > 0 && (
                <div className="mb-4 p-3 bg-white rounded">
                  <h3 className="font-bold mb-2">Proficiencies</h3>
                  {monsterDetails.proficiencies.map((prof: any, idx: number) => (
                    <p key={idx} className="text-sm">
                      <strong>{prof.proficiency?.name || 'Unknown'}:</strong> +{prof.value}
                    </p>
                  ))}
                </div>
              )}

              {/* Damage Vulnerabilities, Resistances, Immunities */}
              {(monsterDetails.damage_vulnerabilities?.length > 0 || 
                monsterDetails.damage_resistances?.length > 0 || 
                monsterDetails.damage_immunities?.length > 0 ||
                monsterDetails.condition_immunities?.length > 0) && (
                <div className="mb-4 p-3 bg-white rounded text-sm">
                  {monsterDetails.damage_vulnerabilities?.length > 0 && (
                    <p className="mb-1">
                      <strong>Vulnerabilities:</strong> {monsterDetails.damage_vulnerabilities.join(', ')}
                    </p>
                  )}
                  {monsterDetails.damage_resistances?.length > 0 && (
                    <p className="mb-1">
                      <strong>Resistances:</strong> {monsterDetails.damage_resistances.join(', ')}
                    </p>
                  )}
                  {monsterDetails.damage_immunities?.length > 0 && (
                    <p className="mb-1">
                      <strong>Damage Immunities:</strong> {monsterDetails.damage_immunities.join(', ')}
                    </p>
                  )}
                  {monsterDetails.condition_immunities?.length > 0 && (
                    <p>
                      <strong>Condition Immunities:</strong> {monsterDetails.condition_immunities.map((c: any) => c?.name || 'Unknown').join(', ')}
                    </p>
                  )}
                </div>
              )}

              {/* Senses */}
              {monsterDetails.senses && (
                <div className="mb-4 p-3 bg-white rounded text-sm">
                  <h3 className="font-bold mb-2">Senses</h3>
                  {Object.entries(monsterDetails.senses).map(([key, value]) => (
                    <p key={key}><strong>{formatSenseKey(key)}:</strong> {value}</p>
                  ))}
                </div>
              )}

              {/* Languages */}
              {monsterDetails.languages && (
                <div className="mb-4 p-3 bg-white rounded text-sm">
                  <p><strong>Languages:</strong> {monsterDetails.languages || 'None'}</p>
                </div>
              )}

              {/* Special Abilities */}
              {monsterDetails.special_abilities && monsterDetails.special_abilities.length > 0 && (
                <div className="mb-4 p-3 bg-white rounded">
                  <h3 className="font-bold mb-2">Special Abilities</h3>
                  {monsterDetails.special_abilities.map((ability: any, idx: number) => (
                    <div key={idx} className="mb-2">
                      <p className="font-semibold text-sm">{ability.name}</p>
                      <p className="text-sm text-gray-700">{ability.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {monsterDetails.actions && monsterDetails.actions.length > 0 && (
                <div className="mb-4 p-3 bg-white rounded">
                  <h3 className="font-bold mb-2">Actions</h3>
                  {monsterDetails.actions.map((action: any, idx: number) => (
                    <div key={idx} className="mb-2">
                      <p className="font-semibold text-sm">{action.name}</p>
                      <p className="text-sm text-gray-700">{action.desc}</p>
                      {action.attack_bonus && (
                        <p className="text-sm"><strong>Attack Bonus:</strong> +{action.attack_bonus}</p>
                      )}
                      {action.damage && action.damage.length > 0 && (
                        <p className="text-sm">
                          <strong>Damage:</strong> {action.damage
                            .filter((d: any) => d?.damage_dice && d?.damage_type)
                            .map((d: any) => `${d.damage_dice} ${d.damage_type?.name || 'unknown'}`)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Legendary Actions */}
              {monsterDetails.legendary_actions && monsterDetails.legendary_actions.length > 0 && (
                <div className="mb-4 p-3 bg-white rounded">
                  <h3 className="font-bold mb-2">Legendary Actions</h3>
                  {monsterDetails.legendary_actions.map((action: any, idx: number) => (
                    <div key={idx} className="mb-2">
                      <p className="font-semibold text-sm">{action.name}</p>
                      <p className="text-sm text-gray-700">{action.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation buttons at the very bottom */}
          <div className="flex justify-between items-center p-4 border-t bg-white">
            <button
              onClick={goToPrevious}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              ← Previous
            </button>
            
            <span className="text-white">
              Monster {currentIndex + 1} of {monsters?.length || 0}
            </span>
            
            <button
              onClick={goToNext}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Next →
            </button>
          </div>
        </div>
      )}
      
      {monsters && !monsterDetails && !isLoadingDetails && !isDetailsError && (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-2">All Monsters ({monsters.length})</h2>
          <p className="text-sm text-gray-600">Click "Random", "Show Index", or use the search to see details</p>
        </div>
      )}
    </>
  )
}

export default App