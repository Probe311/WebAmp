import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle2, XCircle, Award, Trophy } from 'lucide-react'
import { Tutorial } from '../../data/tutorials'
import { Block } from '../Block'
import { useToast } from '../notifications/ToastProvider'

interface QuizViewerProps {
  tutorial: Tutorial
  onBack: () => void
  onComplete?: (tutorialId: string, score: number) => void
}

export function QuizViewer({ tutorial, onBack, onComplete }: QuizViewerProps) {
  const { showToast } = useToast()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [answers, setAnswers] = useState<Map<number, number>>(new Map())

  const questions = tutorial.content?.quiz || []
  const currentQuestion = questions[currentQuestionIndex]

  // Charger la progression depuis localStorage
  useEffect(() => {
    const savedCompleted = localStorage.getItem(`quiz-completed-${tutorial.id}`)
    if (savedCompleted === 'true') {
      setIsCompleted(true)
    }
  }, [tutorial.id])

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || isCompleted) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    setShowResult(true)
    setAnswers(new Map(answers.set(currentQuestionIndex, selectedAnswer)))

    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(answers.get(currentQuestionIndex + 1) || null)
      setShowResult(false)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(answers.get(currentQuestionIndex - 1) || null)
      setShowResult(false)
    }
  }

  const handleComplete = () => {
    const score = Math.round((correctAnswers / questions.length) * 100)
    setIsCompleted(true)
    localStorage.setItem(`quiz-completed-${tutorial.id}`, 'true')
    localStorage.setItem(`quiz-score-${tutorial.id}`, score.toString())
    
    // Ajouter les XP (proportionnel au score)
    const xpEarned = Math.round(tutorial.rewards.xp * (score / 100))
    const currentXP = parseInt(localStorage.getItem('user-xp') || '0', 10)
    const newXP = currentXP + xpEarned
    localStorage.setItem('user-xp', newXP.toString())
    
    showToast({
      variant: score >= 70 ? 'success' : 'info',
      title: score >= 70 ? 'Quiz complété !' : 'Quiz terminé',
      message: `Score : ${score}% - Vous avez gagné ${xpEarned} XP !`
    })
    
    if (onComplete) {
      onComplete(tutorial.id, score)
    }
  }

  const progress = questions.length > 0 
    ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) 
    : 0

  const getAnswerClass = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index
        ? 'bg-orange-500 text-white border-orange-600'
        : 'bg-white dark:bg-gray-700 text-black/70 dark:text-white/70 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
    }

    const isCorrect = index === currentQuestion.correctAnswer
    const isSelected = selectedAnswer === index

    if (isCorrect) {
      return 'bg-green-500 text-white border-green-600'
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-500 text-white border-red-600'
    }
    return 'bg-gray-100 dark:bg-gray-700 text-black/50 dark:text-white/50 border-gray-200 dark:border-gray-600'
  }

  if (isCompleted) {
    const score = Math.round((correctAnswers / questions.length) * 100)
    const savedScore = parseInt(localStorage.getItem(`quiz-score-${tutorial.id}`) || '0', 10)

    return (
      <div className="h-full overflow-y-auto p-6 pb-32">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Retour aux tutoriels</span>
          </button>

          <Block className="p-12 text-center">
            <div className={`
              w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center
              ${score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
            `}>
              <Trophy size={48} className="text-white" />
            </div>

            <h2 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-4">
              Quiz terminé !
            </h2>

            <div className="mb-6">
              <div className="text-6xl font-bold text-orange-500 mb-2">
                {savedScore}%
              </div>
              <p className="text-black/70 dark:text-white/70">
                {correctAnswers} bonnes réponses sur {questions.length}
              </p>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = answers.get(index)
                const isCorrect = userAnswer === question.correctAnswer

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg text-left ${
                      isCorrect
                        ? 'bg-green-500/10 dark:bg-green-500/20 border border-green-500/30'
                        : 'bg-red-500/10 dark:bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="font-medium text-black/85 dark:text-white/90">
                        {question.question}
                      </p>
                    </div>
                    <p className="text-sm text-black/70 dark:text-white/70 ml-7">
                      {question.explanation}
                    </p>
                  </div>
                )
              })}
            </div>

            <button
              onClick={onBack}
              className="mt-8 px-6 py-3 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Retour aux tutoriels
            </button>
          </Block>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Retour aux tutoriels</span>
          </button>

          <div className="mb-4">
            <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-2">
              {tutorial.title}
            </h1>
            
            {/* Barre de progression */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm text-black/60 dark:text-white/60 mb-1">
                <span>Question {currentQuestionIndex + 1} sur {questions.length}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <Block className="p-8 mb-6">
          <h2 className="text-2xl font-bold text-black/85 dark:text-white/90 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`
                  w-full p-4 rounded-xl text-left border-2 transition-all duration-200
                  ${getAnswerClass(index)}
                  ${showResult ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm
                    ${showResult && index === currentQuestion.correctAnswer
                      ? 'bg-green-600 text-white'
                      : showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer
                      ? 'bg-red-600 text-white'
                      : selectedAnswer === index
                      ? 'bg-white text-orange-500'
                      : 'bg-white/50 text-black/50'
                    }
                  `}>
                    {showResult && index === currentQuestion.correctAnswer ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explication */}
          {showResult && (
            <div className={`mt-6 p-4 rounded-xl ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-green-500/10 dark:bg-green-500/20 border border-green-500/30'
                : 'bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30'
            }`}>
              <div className="flex items-start gap-3">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-black/85 dark:text-white/90 mb-1">
                    {selectedAnswer === currentQuestion.correctAnswer ? 'Bonne réponse !' : 'Mauvaise réponse'}
                  </p>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Block>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all duration-200
              ${currentQuestionIndex === 0
                ? 'bg-gray-200 dark:bg-gray-700 text-black/30 dark:text-white/30 cursor-not-allowed'
                : 'bg-white dark:bg-gray-700 text-black/70 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-lg'
              }
            `}
          >
            Précédent
          </button>

          <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
            <div className="p-3 rounded-xl bg-yellow-500/10 group-hover:scale-110 transition-transform duration-300">
              <Award size={16} className="text-yellow-500" />
            </div>
            <span>{tutorial.rewards.xp} XP à gagner</span>
          </div>

          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all duration-200
                ${selectedAnswer === null
                  ? 'bg-gray-200 dark:bg-gray-700 text-black/30 dark:text-white/30 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
                }
              `}
            >
              Valider
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

