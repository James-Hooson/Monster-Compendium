import { useQuery } from '@tanstack/react-query'
import { Monster } from '../../Types/MonsterModel'
import { getMonsters, getMonsterDetails } from '../../apiClient'

const useMonsterData = () => {
  const { data: monsters, isPending, isError } = useQuery({
    queryKey: ['monsters'],
    queryFn: getMonsters
  })

  const { data: allMonsterDetails } = useQuery({
    queryKey: ['all-monsters-details'],
    queryFn: async () => {
      if (!monsters) return []
      const details = await Promise.all(
        monsters.map((m: Monster) => getMonsterDetails(m.index).catch(() => null))
      )
      return details.filter(Boolean)
    },
    enabled: !!monsters && monsters.length > 0
  })

  return { monsters, allMonsterDetails, isPending, isError }
}
export default useMonsterData