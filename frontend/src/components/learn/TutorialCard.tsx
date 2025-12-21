import { LucideIcon, Clock, Award, CheckCircle2, PlayCircle, Lock } from 'lucide-react'
import { Tutorial, TutorialDifficulty, difficultyLabels, difficultyColors, categoryIcons } from '../../data/tutorials'
import { Block } from '../Block'
import * as LucideIcons from 'lucide-react'

interface TutorialCardProps {
  tutorial: Tutorial
  progress?: number // 0-100
  completed?: boolean
  earnedXP?: number // XP gagnée par l'utilisateur (basée sur la progression)
  onStart: (tutorialId: string) => void
  lessonsCompleted?: number
  lessonsTotal?: number
  lastLessonTitle?: string | null
  isLocked?: boolean // Si le cours est premium et non acheté
  isPremium?: boolean // Si le cours est premium
}

export function TutorialCard({
  tutorial,
  progress = 0,
  completed = false,
  earnedXP,
  onStart,
  lessonsCompleted,
  lessonsTotal,
  lastLessonTitle,
  isLocked = false,
  isPremium = false
}: TutorialCardProps) {
  // Récupérer l'icône de catégorie ou utiliser l'icône du tutoriel
  const categoryIconName = categoryIcons[tutorial.category] || tutorial.icon
  const IconComponent = (LucideIcons[categoryIconName as keyof typeof LucideIcons] || LucideIcons.BookOpen) as LucideIcon

  const getDifficultyColor = (difficulty: TutorialDifficulty) => {
    return difficultyColors[difficulty] || 'bg-gray-500'
  }

  const getDifficultyBgColor = (difficulty: TutorialDifficulty) => {
    const colorMap: Record<TutorialDifficulty, string> = {
      // Le vert est réservé pour l'état "cours terminé"
      beginner: 'bg-blue-500/10',
      intermediate: 'bg-yellow-500/10',
      advanced: 'bg-red-500/10',
      pro: 'bg-purple-500/10',
    }
    return colorMap[difficulty] || 'bg-gray-500/10'
  }

  const getDifficultyTextColor = (difficulty: TutorialDifficulty) => {
    const colorMap: Record<TutorialDifficulty, string> = {
      // Le vert est réservé pour l'état "cours terminé"
      beginner: 'text-blue-500',
      intermediate: 'text-yellow-500',
      advanced: 'text-red-500',
      pro: 'text-purple-500',
    }
    return colorMap[difficulty] || 'text-gray-500'
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      tutorial: 'Tutoriel',
      guide: 'Guide',
      quiz: 'Quiz',
      preset: 'Preset',
    }
    return labels[type] || type
  }

  const handleClick = () => {
    if (isLocked) {
      return // Ne pas ouvrir si verrouillé
    }
    onStart(tutorial.id)
  }

  return (
    <Block className={`p-6 hover:shadow-lg transition-all duration-300 group relative ${isLocked ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`} onClick={handleClick}>
      {/* Overlay de lock si premium non acheté */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="text-center">
            <Lock size={32} className="text-white mx-auto mb-2" />
            <p className="text-white font-bold text-sm">Cours Premium</p>
            <p className="text-white/80 text-xs">Achetez le pack pour débloquer</p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icône */}
        <div className={`
          p-4 rounded-xl 
          ${progress === 100 ? 'bg-green-500/10' : getDifficultyBgColor(tutorial.difficulty)}
          group-hover:scale-110 transition-transform duration-300
        `}>
          {progress === 100 ? (
            <CheckCircle2 
              size={32} 
              className="text-green-500"
            />
          ) : (
            <IconComponent 
              size={32} 
              className={getDifficultyTextColor(tutorial.difficulty)}
            />
          )}
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-black/85 dark:text-white/90 mb-1 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                {tutorial.title}
              </h3>
              <p className="text-sm text-black/70 dark:text-white/70 line-clamp-2">
                {tutorial.description}
              </p>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="flex items-center gap-4 flex-wrap mt-3">
            {/* Badge difficulté */}
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium text-white
              ${getDifficultyColor(tutorial.difficulty)}
            `}>
              {difficultyLabels[tutorial.difficulty]}
            </span>

            {/* Type */}
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-black/70 dark:text-white/70">
              {getTypeLabel(tutorial.type)}
            </span>

            {/* Badge Premium */}
            {isPremium && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500 text-white">
                Premium
              </span>
            )}

            {/* Durée */}
            <div className="flex items-center gap-1 text-xs text-black/60 dark:text-white/60">
              <Clock size={14} />
              <span>{tutorial.duration} min</span>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1 text-xs text-black/60 dark:text-white/60">
              <div className="p-2 rounded-xl bg-yellow-500/10 group-hover:scale-110 transition-transform duration-300">
                <Award size={14} className="text-yellow-500" />
              </div>
              <span>
                {earnedXP !== undefined && earnedXP > 0 
                  ? `${earnedXP} / ${tutorial.rewards.xp} XP`
                  : `${tutorial.rewards.xp} XP`
                }
              </span>
            </div>
          </div>

          {/* Mini résumé des leçons */}
          {lessonsTotal !== undefined && lessonsTotal > 0 && (
            <div className="mt-2 text-xs text-black/60 dark:text-white/60">
              <span>
                Leçons : {lessonsCompleted ?? 0}/{lessonsTotal}
              </span>
              {lastLessonTitle && (
                <span className="italic line-clamp-1" title={lastLessonTitle}>
                  Dernière : {lastLessonTitle}
                </span>
              )}
            </div>
          )}

          {/* Progression */}
          {progress > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-black/60 dark:text-white/60 mb-1">
                <span>Progression</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    progress === 100 ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Bouton d'action */}
          <div className="mt-4 flex items-center justify-end">
            {isLocked ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: Ouvrir modal d'achat du pack
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm bg-amber-500 text-white hover:bg-amber-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Lock size={16} />
                Débloquer
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onStart(tutorial.id)
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm
                  transition-all duration-200
                  ${progress === 100
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20'
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {progress === 100 ? (
                  <>
                    <CheckCircle2 size={16} />
                    Revoir
                  </>
                ) : progress > 0 ? (
                  <>
                    <PlayCircle size={16} />
                    Continuer
                  </>
                ) : (
                  <>
                    <PlayCircle size={16} />
                    Commencer
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Block>
  )
}

