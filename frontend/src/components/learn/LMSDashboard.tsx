// Dashboard LMS pour afficher les statistiques et la progression
import { useEffect, useState } from 'react'
import { useUserStats } from '../../hooks/useLMS'
import { Block } from '../Block'
import { Loader } from '../Loader'
import { lmsService } from '../../services/lms'

interface LMSDashboardProps {
  userId: string
}

export function LMSDashboard({ userId }: LMSDashboardProps) {
  const { stats, loading } = useUserStats(userId)
  const [xpHistory, setXpHistory] = useState<Array<{ course_id: string; title: string; xp: number; completed_at: string }>>([])

  useEffect(() => {
    const loadHistory = async () => {
      if (!userId) return
      const history = await lmsService.getUserXpHistory(userId, 5)
      setXpHistory(history)
    }
    loadHistory()
  }, [userId])

  if (loading) {
    return (
      <Block className="p-8">
        <Loader size="md" text="Chargement des statistiques..." showText={true} />
      </Block>
    )
  }

  if (!stats) {
    return (
      <Block className="p-8">
        <p className="text-center text-black/70 dark:text-white/70">
          Aucune statistique disponible
        </p>
      </Block>
    )
  }
}

