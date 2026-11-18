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
 ? 'neu-accent-btn border-[color:var(--neu-accent)]'
        : 'neu-inset text-[color:var(--neu-text-muted)] border-[color:var(--neu-edge)] hover:bg-[color:var(--neu-bg-hollow)]'
 }

 const isCorrect = index === currentQuestion.correctAnswer
 const isSelected = selectedAnswer === index

 if (isCorrect) {
 return 'bg-[var(--td-success)] text-white border-[var(--td-success)]'
 }
 if (isSelected && !isCorrect) {
 return 'bg-[var(--td-danger)] text-white border-[var(--td-danger)]'
 }
    return 'bg-[color:var(--neu-bg-track)] text-[color:var(--neu-text-faint)] border-[color:var(--neu-edge)]'
  }

  if (isCompleted) {
 const score = Math.round((correctAnswers / questions.length) * 100)
 const savedScore = parseInt(localStorage.getItem(`quiz-score-${tutorial.id}`) || '0', 10)

 return (
 <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32">
 <div className="max-w-2xl mx-auto">
 <button
 onClick={onBack}
            className="flex items-center gap-2 text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-accent)] dark:hover:text-[color:var(--neu-accent)] transition-colors mb-6"
 >
 <ArrowLeft size={20} />
 <span>Retour aux tutoriels</span>
 </button>

 <Block className="p-12 text-center">
 <div className={`
 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center
 ${score >= 70 ? 'bg-[var(--td-success)]' : score >= 50 ? 'bg-[var(--td-warning)]' : 'bg-[var(--td-danger)]'}
 `}>
 <Trophy size={48} className="text-white" />
 </div>

            <h2 className="text-3xl font-bold text-[color:var(--neu-text)] mb-4">
 Quiz terminé !
 </h2>

 <div className="mb-6">
 <div className="text-6xl font-bold text-[color:var(--neu-accent)] mb-2">
 {savedScore}%
 </div>
              <p className="text-[color:var(--neu-text-muted)]">
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
 className={`p-4 rounded-[var(--td-radius-control)] text-left ${
 isCorrect
 ? 'bg-[var(--td-success-surface)] border border-[var(--td-success)]/30'
 : 'bg-[var(--td-danger-surface)] border border-[var(--td-danger)]/30'
 }`}
 >
 <div className="flex items-start gap-2 mb-2">
 {isCorrect ? (
 <CheckCircle2 size={20} className="text-[var(--td-success)] flex-shrink-0 mt-0.5" />
 ) : (
 <XCircle size={20} className="text-[var(--td-danger)] flex-shrink-0 mt-0.5" />
 )}
                      <p className="font-medium text-[color:var(--neu-text)]">
 {question.question}
 </p>
 </div>
                    <p className="text-sm text-[color:var(--neu-text-muted)] ml-7">
 {question.explanation}
 </p>
 </div>
 )
 })}
 </div>

 <button
 onClick={onBack}
 className="mt-8 px-6 py-3 rounded-[var(--td-radius-well)] font-medium neu-accent-btn transition-all duration-200"
 >
 Retour aux tutoriels
 </button>
 </Block>
 </div>
 </div>
 )
  }

  return (
 <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32">
 <div className="max-w-2xl mx-auto">
 {/* Header */}
 <div className="mb-6">
 <button
 onClick={onBack}
            className="flex items-center gap-2 text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-accent)] dark:hover:text-[color:var(--neu-accent)] transition-colors mb-4"
 >
 <ArrowLeft size={20} />
 <span>Retour aux tutoriels</span>
 </button>

 <div className="mb-4">
            <h1 className="text-3xl font-bold text-[color:var(--neu-text)] mb-2">
 {tutorial.title}
 </h1>
 
 {/* Barre de progression */}
 <div className="mb-2">
              <div className="flex items-center justify-between text-sm text-[color:var(--neu-text-muted)] mb-1">
 <span>Question {currentQuestionIndex + 1} sur {questions.length}</span>
 <span>{progress}%</span>
 </div>
              <div className="h-3 bg-[color:var(--neu-bg-hollow)] rounded-full overflow-hidden">
 <div 
 className="h-full bg-[color:var(--neu-accent)] transition-all duration-300"
 style={{ width: `${progress}%` }}
 />
 </div>
 </div>
 </div>
 </div>

 {/* Question */}
 <Block className="p-8 mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--neu-text)] mb-6">
 {currentQuestion.question}
 </h2>

 <div className="space-y-3">
 {currentQuestion.options.map((option, index) => (
 <button
 key={index}
 onClick={() => handleAnswerSelect(index)}
 disabled={showResult}
 className={`
 w-full p-4 rounded-[var(--td-radius-well)] text-left border-2 transition-all duration-200
 ${getAnswerClass(index)}
 ${showResult ? 'cursor-default' : 'cursor-pointer'}
 `}
 >
 <div className="flex items-center gap-3">
 <div className={`
 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm
 ${showResult && index === currentQuestion.correctAnswer
 ? 'bg-[var(--td-success)] text-white'
 : showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer
 ? 'bg-[var(--td-danger)] text-white'
 : selectedAnswer === index
                      ? 'bg-[color:var(--neu-bg)] text-[color:var(--neu-accent)]'
                      : 'bg-[color:var(--neu-bg)]/50 text-[color:var(--neu-text-faint)]'
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
 <div className={`mt-6 p-4 rounded-[var(--td-radius-well)] ${
 selectedAnswer === currentQuestion.correctAnswer
 ? 'bg-[var(--td-success-surface)] border border-[var(--td-success)]/30'
 : 'bg-[color:var(--neu-accent-soft)] border border-[color:var(--neu-accent)]/30'
 }`}>
 <div className="flex items-start gap-3">
 {selectedAnswer === currentQuestion.correctAnswer ? (
 <CheckCircle2 size={20} className="text-[var(--td-success)] flex-shrink-0 mt-0.5" />
 ) : (
 <XCircle size={20} className="text-[var(--td-danger)] flex-shrink-0 mt-0.5" />
 )}
 <div>
                  <p className="font-medium text-[color:var(--neu-text)] mb-1">
 {selectedAnswer === currentQuestion.correctAnswer ? 'Bonne réponse !' : 'Mauvaise réponse'}
 </p>
                  <p className="text-sm text-[color:var(--neu-text-muted)]">
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
 px-6 py-3 rounded-[var(--td-radius-well)] font-medium transition-all duration-200
 ${currentQuestionIndex === 0
                ? 'bg-[color:var(--neu-bg-hollow)] text-[color:var(--neu-text-faint)] cursor-not-allowed'
                : 'neu-inset text-[color:var(--neu-text-muted)] hover:bg-[color:var(--neu-bg-track)] shadow-lg'
 }
 `}
 >
 Précédent
 </button>

          <div className="flex items-center gap-2 text-sm text-[color:var(--neu-text-muted)]">
 <div className="p-3 rounded-[var(--td-radius-well)] bg-[var(--td-warning-surface)] group-hover:scale-110 transition-transform duration-300">
 <Award size={16} className="text-[var(--td-warning)]" />
 </div>
 <span>{tutorial.rewards.xp} XP à gagner</span>
 </div>

 {!showResult ? (
 <button
 onClick={handleSubmitAnswer}
 disabled={selectedAnswer === null}
 className={`
 px-6 py-3 rounded-[var(--td-radius-well)] font-medium transition-all duration-200
 ${selectedAnswer === null
                  ? 'bg-[color:var(--neu-bg-hollow)] text-[color:var(--neu-text-faint)] cursor-not-allowed'
 : 'neu-accent-btn'
 }
 `}
 >
 Valider
 </button>
 ) : (
 <button
 onClick={handleNext}
 className="px-6 py-3 rounded-[var(--td-radius-well)] font-medium neu-accent-btn transition-all duration-200"
 >
 {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
 </button>
 )}
 </div>
 </div>
 </div>
  )
}

