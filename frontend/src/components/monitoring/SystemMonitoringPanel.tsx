import { useEffect, useState } from 'react'
import { Cpu, HardDrive, MemoryStick, Monitor } from 'lucide-react'

interface SystemStats {
  cpu: number
  memory: {
    used: number
    total: number
    percent: number
  }
  disk: {
    used: number
    total: number
    percent: number
  }
  network?: {
    upload: number
    download: number
  }
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const getColorClass = (value: number, thresholds: { good: number; warning: number }): string => {
  if (value >= thresholds.warning) return 'text-red-500'
  if (value >= thresholds.good) return 'text-yellow-500'
  return 'text-green-500'
}

const getBarColor = (value: number, thresholds: { good: number; warning: number }): string => {
  if (value >= thresholds.warning) return 'bg-red-500'
  if (value >= thresholds.good) return 'bg-yellow-500'
  return 'bg-green-500'
}

export function SystemMonitoringPanel() {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 0,
    memory: { used: 0, total: 0, percent: 0 },
    disk: { used: 0, total: 0, percent: 0 }
  })

  useEffect(() => {
    let cpuUsage = 0
    let lastMeasureTime = performance.now()
    let samples: number[] = []
    let frameCount = 0
    let totalFrameTime = 0
    let rafId: number | null = null
    let isActive = true

    // Utiliser requestAnimationFrame pour mesurer le CPU de manière plus précise
    const measureCpuWithRAF = () => {
      if (!isActive) return
      
      const now = performance.now()
      const frameTime = now - lastMeasureTime
      
      if (frameTime > 0) {
        // Le temps de frame idéal est ~16.67ms pour 60fps
        // Si le frame prend plus de temps, c'est que le CPU est chargé
        const idealFrameTime = 16.67
        const cpuLoad = Math.min(100, Math.max(0, ((frameTime / idealFrameTime) - 1) * 100))
        
        samples.push(cpuLoad)
        if (samples.length > 20) {
          samples.shift()
        }
        
        // Moyenne mobile pondérée (plus de poids aux valeurs récentes)
        const weights = samples.map((_, i) => (i + 1) / samples.length)
        const weightedSum = samples.reduce((sum, val, i) => sum + val * weights[i], 0)
        const weightSum = weights.reduce((sum, w) => sum + w, 0)
        cpuUsage = weightedSum / weightSum
        
        frameCount++
        totalFrameTime += frameTime
      }
      
      lastMeasureTime = now
      rafId = requestAnimationFrame(measureCpuWithRAF)
    }

    // Démarrer la mesure avec RAF
    rafId = requestAnimationFrame(measureCpuWithRAF)

    // Fonction pour estimer l'utilisation CPU
    const estimateCpuUsage = () => {
      // Utiliser la méthode RAF
      if (frameCount > 0 && totalFrameTime > 0) {
        const avgFrameTime = totalFrameTime / frameCount
        const idealFrameTime = 16.67
        const cpuFromFrames = Math.min(100, Math.max(0, ((avgFrameTime / idealFrameTime) - 1) * 100))
        
        // Combiner avec la moyenne mobile pour plus de stabilité
        return Math.max(0, Math.min(100, cpuUsage * 0.7 + cpuFromFrames * 0.3))
      }
      
      return Math.max(0, Math.min(100, cpuUsage))
    }

    // Fonction pour récupérer les métriques système
    const fetchSystemStats = async () => {
      try {
        const stats: SystemStats = {
          cpu: estimateCpuUsage(),
          memory: { used: 0, total: 0, percent: 0 },
          disk: { used: 0, total: 0, percent: 0 }
        }

        // Mémoire - Utiliser toutes les APIs disponibles pour une mesure plus précise
        let memoryUsed = 0
        let memoryTotal = 0
        let memoryPercent = 0

        // 1. Performance Memory API (Chrome/Edge) - Plus précis pour la mémoire JS utilisée
        let jsHeapUsed = 0
        let jsHeapLimit = 0
        
        if ('memory' in performance) {
          const memInfo = (performance as any).memory
          jsHeapUsed = memInfo.usedJSHeapSize
          jsHeapLimit = memInfo.jsHeapSizeLimit || memInfo.totalJSHeapSize || 0
        }

        // 2. Device Memory API - Pour obtenir la RAM système totale
        let systemRamTotal = 0
        if ('deviceMemory' in navigator) {
          const deviceMemGB = (navigator as any).deviceMemory
          systemRamTotal = deviceMemGB * 1024 * 1024 * 1024 // Convertir GB en bytes
        }

        // 3. Calculer les valeurs finales
        if (systemRamTotal > 0) {
          // Priorité: Afficher la RAM système totale si disponible
          memoryTotal = systemRamTotal
          
          if (jsHeapUsed > 0) {
            // Utiliser la mémoire JS utilisée comme indicateur
            // Mais on peut aussi estimer l'utilisation système totale
            // Le navigateur utilise généralement plus que juste le heap JS
            // Estimation: le navigateur utilise environ 2-3x le heap JS
            const estimatedSystemUsage = jsHeapUsed * 2.5
            memoryUsed = Math.min(estimatedSystemUsage, systemRamTotal * 0.8) // Limiter à 80% max
            memoryPercent = (memoryUsed / memoryTotal) * 100
          } else {
            // Pas de mesure JS, estimation basée sur la RAM système
            // Estimation conservatrice: 15-25% de la RAM système utilisée par le navigateur
            memoryUsed = systemRamTotal * 0.2
            memoryPercent = 20
          }
        } else if (jsHeapLimit > 0) {
          // Fallback: Utiliser la limite du heap JS si pas de RAM système disponible
          memoryTotal = jsHeapLimit
          memoryUsed = jsHeapUsed || 0
          memoryPercent = memoryTotal > 0 ? (memoryUsed / memoryTotal) * 100 : 0
        } else {
          // Aucune API disponible
          memoryUsed = 0
          memoryTotal = 0
          memoryPercent = 0
        }

        stats.memory = {
          used: memoryUsed,
          total: memoryTotal,
          percent: Math.min(100, Math.max(0, memoryPercent))
        }

        // Disque - nécessite une API backend, on laisse à 0 pour l'instant
        // Les informations de disque ne sont pas accessibles depuis le navigateur pour des raisons de sécurité

        setSystemStats(stats)
      } catch (error) {
        console.error('Erreur lors de la récupération des métriques système:', error)
      }
    }

    fetchSystemStats()
    const interval = setInterval(fetchSystemStats, 1000)

    return () => {
      isActive = false
      clearInterval(interval)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black/85 dark:text-white/90">
      {/* CPU */}
      <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(60,60,60,0.9)] border border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#f7f7f7] dark:bg-gray-700 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,1)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,1)]">
            <Cpu size={20} className="text-black/60 dark:text-white/60" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-black/70 dark:text-white/70">CPU</h3>
            <p className="text-xs text-black/50 dark:text-white/50">Processeur</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className={`text-2xl font-bold ${getColorClass(systemStats.cpu, { good: 60, warning: 80 })}`}>
            {systemStats.cpu.toFixed(1)}%
          </div>
          <div className="w-full h-3 bg-[#f5f5f5] dark:bg-gray-700 rounded-md overflow-hidden shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]">
            <div
              className={`h-full rounded-md transition-[width] duration-300 ease-linear ${getBarColor(systemStats.cpu, { good: 60, warning: 80 })}`}
              style={{ width: `${Math.min(systemStats.cpu, 100)}%` }}
            />
          </div>
          <p className="text-xs text-black/50 dark:text-white/50">
            {systemStats.cpu > 0 ? 'Utilisation estimée en temps réel' : 'Mesure en cours...'}
          </p>
        </div>
      </div>

      {/* Mémoire */}
      <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(60,60,60,0.9)] border border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#f7f7f7] dark:bg-gray-700 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,1)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,1)]">
            <MemoryStick size={20} className="text-black/60 dark:text-white/60" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-black/70 dark:text-white/70">Mémoire</h3>
            <p className="text-xs text-black/50 dark:text-white/50">RAM</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className={`text-2xl font-bold ${getColorClass(systemStats.memory.percent, { good: 70, warning: 85 })}`}>
            {systemStats.memory.percent.toFixed(1)}%
          </div>
          <div className="w-full h-3 bg-[#f5f5f5] dark:bg-gray-700 rounded-md overflow-hidden shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]">
            <div
              className={`h-full rounded-md transition-[width] duration-300 ease-linear ${getBarColor(systemStats.memory.percent, { good: 70, warning: 85 })}`}
              style={{ width: `${Math.min(systemStats.memory.percent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-black/50 dark:text-white/50">
            {formatBytes(systemStats.memory.used)} / {formatBytes(systemStats.memory.total)}
          </p>
        </div>
      </div>

      {/* Disque */}
      <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(60,60,60,0.9)] border border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#f7f7f7] dark:bg-gray-700 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,1)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,1)]">
            <HardDrive size={20} className="text-black/60 dark:text-white/60" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-black/70 dark:text-white/70">Disque</h3>
            <p className="text-xs text-black/50 dark:text-white/50">Stockage</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className={`text-2xl font-bold ${getColorClass(systemStats.disk.percent, { good: 80, warning: 90 })}`}>
            {systemStats.disk.percent > 0 ? `${systemStats.disk.percent.toFixed(1)}%` : 'N/A'}
          </div>
          {systemStats.disk.percent > 0 && (
            <div className="w-full h-3 bg-[#f5f5f5] dark:bg-gray-700 rounded-md overflow-hidden shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]">
              <div
                className={`h-full rounded-md transition-[width] duration-300 ease-linear ${getBarColor(systemStats.disk.percent, { good: 80, warning: 90 })}`}
                style={{ width: `${Math.min(systemStats.disk.percent, 100)}%` }}
              />
            </div>
          )}
          <p className="text-xs text-black/50 dark:text-white/50">
            {systemStats.disk.total > 0
              ? `${formatBytes(systemStats.disk.used)} / ${formatBytes(systemStats.disk.total)}`
              : 'Nécessite une connexion backend'}
          </p>
        </div>
      </div>

      {/* Informations système */}
      <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(60,60,60,0.9)] border border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#f7f7f7] dark:bg-gray-700 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,1)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,1)]">
            <Monitor size={20} className="text-black/60 dark:text-white/60" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-black/70 dark:text-white/70">Système</h3>
            <p className="text-xs text-black/50 dark:text-white/50">Informations</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-black/60 dark:text-white/60">Plateforme:</span>
            <span className="font-medium">{navigator.platform}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black/60 dark:text-white/60">User Agent:</span>
            <span className="font-medium text-xs truncate max-w-[200px]" title={navigator.userAgent}>
              {navigator.userAgent.split(' ')[0]}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-black/60 dark:text-white/60">Cœurs CPU:</span>
            <span className="font-medium">{navigator.hardwareConcurrency || 'N/A'}</span>
          </div>
          {('deviceMemory' in navigator) && (
            <div className="flex justify-between">
              <span className="text-black/60 dark:text-white/60">Mémoire totale:</span>
              <span className="font-medium">{(navigator as any).deviceMemory} GB</span>
            </div>
          )}
          {('connection' in navigator) && (
            <div className="flex justify-between">
              <span className="text-black/60 dark:text-white/60">Connexion:</span>
              <span className="font-medium text-xs">
                {(navigator as any).connection?.effectiveType || 'N/A'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

