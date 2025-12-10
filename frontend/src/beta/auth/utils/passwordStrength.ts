export interface PasswordStrength {
  score: number
  label: string
  colorClass: string
  barClass: string
  recommendations: string[]
}

const weakPasswords = ['password', '123456', 'azerty', 'qwerty', 'webamp']

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: 'Très faible',
      colorClass: 'text-rose-600',
      barClass: 'bg-rose-500',
      recommendations: ['Utilise au moins 12 caractères.']
    }
  }

  const lengthScore = Math.min(40, Math.max(0, (password.length - 5) * 4))
  const diversityChecks = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/]
  const diversityScore = diversityChecks.reduce((score, regex) => score + (regex.test(password) ? 10 : 0), 0)

  const bonus = password.length >= 16
    ? 15
    : password.length >= 12
      ? 10
      : password.length >= 8
        ? 5
        : 0

  const repeatPenalty = /(.)\1{2,}/.test(password) ? -10 : 0
  const dictionaryPenalty = weakPasswords.some((entry) => password.toLowerCase().includes(entry)) ? -25 : 0

  const rawScore = lengthScore + diversityScore + bonus + repeatPenalty + dictionaryPenalty
  const score = Math.max(0, Math.min(100, rawScore))

  let label = 'Faible'
  let colorClass = 'text-rose-600'
  let barClass = 'bg-rose-500'

  if (score > 90) {
    label = 'Excellent'
    colorClass = 'text-emerald-700'
    barClass = 'bg-emerald-500'
  } else if (score >= 80) {
    label = 'Fort'
    colorClass = 'text-yellow-700'
    barClass = 'bg-yellow-500'
  } else if (score >= 70) {
    label = 'Correct'
    colorClass = 'text-orange-700'
    barClass = 'bg-orange-500'
  }

  const recommendations: string[] = []
  if (password.length < 12) {
    recommendations.push('Passe à 12 caractères ou plus.')
  }
  if (!/[A-Z]/.test(password)) {
    recommendations.push('Ajoute une majuscule.')
  }
  if (!/[a-z]/.test(password)) {
    recommendations.push('Ajoute une minuscule.')
  }
  if (!/\d/.test(password)) {
    recommendations.push('Ajoute un chiffre.')
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    recommendations.push('Ajoute un caractère spécial.')
  }

  return { score, label, colorClass, barClass, recommendations }
}

