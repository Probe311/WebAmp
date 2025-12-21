import { useEffect, useCallback } from 'react'
import { analyticsService } from '../services/analytics'
import { useAuth } from '../auth/AuthProvider'

/**
 * Hook pour utiliser le service analytics
 */
export function useAnalytics() {
  const { user } = useAuth()

  useEffect(() => {
    // Initialiser le service avec l'ID utilisateur si disponible
    analyticsService.init(user?.id)
  }, [user?.id])

  const track = useCallback((eventName: string, properties?: Record<string, any>) => {
    analyticsService.track(eventName, properties, user?.id)
  }, [user?.id])

  const pageView = useCallback((path: string) => {
    analyticsService.pageView(path, user?.id)
  }, [user?.id])

  const trackClick = useCallback((elementName: string, properties?: Record<string, any>) => {
    analyticsService.click(elementName, properties, user?.id)
  }, [user?.id])

  const trackError = useCallback((errorName: string, errorDetails?: any) => {
    analyticsService.error(errorName, errorDetails, user?.id)
  }, [user?.id])

  return {
    track,
    pageView,
    trackClick,
    trackError
  }
}

