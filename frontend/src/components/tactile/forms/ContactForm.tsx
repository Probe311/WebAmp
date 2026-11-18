import { useState, type FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Panel } from '../primitives'
import { CheckboxField } from './Choice'
import { PillButton } from './PillButton'
import { TextField } from './TextField'

export interface ContactFormValues {
  name: string
  email: string
  acceptedTerms: boolean
}

export interface ContactFormProps {
  title?: string
  subtitle?: string
  /** Appelé une fois la validation passée. */
  onSubmit?: (values: ContactFormValues) => void
  className?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Formulaire de démonstration assemblé à partir des champs du design system :
 * il ne duplique ni les champs ni la validation visuelle.
 */
export function ContactForm({
  title = 'Formulaire de contact',
  subtitle = 'Remplissez les informations ci-dessous',
  onSubmit,
  className,
}: ContactFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; acceptedTerms?: string }>({})
  const [submitted, setSubmitted] = useState(false)

  const reset = () => {
    setName('')
    setEmail('')
    setAcceptedTerms(false)
    setErrors({})
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!name.trim()) nextErrors.name = 'Le nom est requis'
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'Un email valide est requis'
    if (!acceptedTerms) nextErrors.acceptedTerms = 'Veuillez accepter les conditions'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitted(true)
    onSubmit?.({ name: name.trim(), email: email.trim(), acceptedTerms })
  }

  return (
    <Panel depth="flat" className={className ? `w-full max-w-md rounded-3xl p-6 ${className}` : 'w-full max-w-md rounded-3xl p-6'}>
      {submitted ? (
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 className="mb-3 h-8 w-8 text-emerald-500" />
          <h3 className="text-sm font-bold text-[color:var(--neu-text)]">Formulaire envoyé</h3>
          <p className="mt-1 text-xs text-[color:var(--neu-text-muted)]">Merci, nous reviendrons vers vous rapidement.</p>
          <PillButton
            size="sm"
            className="mt-4"
            onClick={() => {
              setSubmitted(false)
              reset()
            }}
          >
            Réinitialiser
          </PillButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <h3 className="text-base font-bold text-[color:var(--neu-text)]">{title}</h3>
            <p className="mt-0.5 mb-5 text-xs text-[color:var(--neu-text-muted)]">{subtitle}</p>
          </div>

          <TextField
            label="Nom complet"
            placeholder="Prénom Nom"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors.name}
            autoComplete="name"
          />

          <TextField
            label="Adresse email"
            type="email"
            placeholder="contact@exemple.fr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <div>
            <CheckboxField
              label="J'accepte les conditions générales"
              checked={acceptedTerms}
              onChange={setAcceptedTerms}
            />
            {errors.acceptedTerms && (
              <p role="alert" className="mt-1 px-1 text-xs text-rose-500">
                {errors.acceptedTerms}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <PillButton variant="ghost" size="sm" onClick={reset}>
              Effacer
            </PillButton>
            <PillButton type="submit" variant="primary">
              Envoyer la demande
            </PillButton>
          </div>
        </form>
      )}
    </Panel>
  )
}
