import { useRef, useState, type DragEvent } from 'react'
import { CheckCircle2, FileText, UploadCloud, X } from 'lucide-react'
import { cx } from '../../ui/cx'
import { IconAction, Panel } from '../primitives'

export interface DroppedFile {
  name: string
  /** Taille lisible, déjà formatée. */
  size: string
}

export interface FileDropzoneProps {
  label?: string
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  onFilesSelected?: (files: File[]) => void
  className?: string
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} Mo` : `${Math.round(bytes / 1024)} Ko`

/**
 * Zone de dépôt de fichiers : sélection par clic, glisser-déposer et liste des
 * fichiers retenus. Le champ `input` reste natif et accessible.
 */
export function FileDropzone({
  label = 'Ajout de fichier',
  accept,
  multiple = false,
  maxSizeMb = 10,
  onFilesSelected,
  className,
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState<DroppedFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return
    const accepted = Array.from(list).filter((file) => file.size <= maxSizeMb * 1024 * 1024)
    const described = accepted.map((file) => ({ name: file.name, size: formatSize(file.size) }))
    setFiles((current) => (multiple ? [...current, ...described] : described))
    onFilesSelected?.(accepted)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  return (
    <div className={cx('flex w-full flex-col gap-2', className)}>
      {label && <span className="px-1 text-xs font-semibold text-[color:var(--neu-text-muted)]">{label}</span>}

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${label} : déposer des fichiers ou parcourir`}
        className={cx(
          'neu-inset flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition-colors',
          dragging
            ? 'border-[color:var(--neu-accent)] bg-[color:var(--neu-accent-soft)]'
            : 'border-[color:var(--neu-edge)] hover:border-[color:var(--neu-text-faint)]'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <span className="neu-flat mb-3 grid h-12 w-12 place-items-center rounded-full text-[color:var(--neu-accent)]">
          <UploadCloud className="h-6 w-6" />
        </span>
        <p className="text-sm font-semibold text-[color:var(--neu-text)]">
          Glissez vos fichiers ici ou <span className="underline">parcourez</span>
        </p>
        <p className="mt-1 text-xs text-[color:var(--neu-text-faint)]">Taille maximale : {maxSizeMb} Mo</p>
      </div>

      {files.length > 0 && (
        <ul className="mt-2 flex flex-col gap-2">
          {files.map((file) => (
            <li
              key={file.name}
              className="neu-flat-sm flex items-center justify-between gap-3 rounded-full px-4 py-2.5 text-xs"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0 text-[color:var(--neu-accent)]" />
                <span className="truncate font-medium text-[color:var(--neu-text)]">{file.name}</span>
                <span className="shrink-0 text-[10px] text-[color:var(--neu-text-faint)]">{file.size}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <IconAction
                  label={`Retirer ${file.name}`}
                  tone="danger"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation()
                    setFiles((current) => current.filter((item) => item.name !== file.name))
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </IconAction>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export interface DownloadCardProps {
  fileName?: string
  fileSize?: string
  /** Extension affichée dans la vignette (ZIP, PDF…). */
  fileExtension?: string
  /** Distance de la barre de progression, fournie par l'appelant. */
  progress?: number
  completed?: boolean
  onDownload?: () => void
  className?: string
}

/** Carte de téléchargement : la progression vient de l'appelant, pas d'un faux minuteur. */
export function DownloadCard({
  fileName = 'export.zip',
  fileSize = '—',
  fileExtension = 'ZIP',
  progress = 0,
  completed = false,
  onDownload,
  className,
}: DownloadCardProps) {
  return (
    <Panel depth="flat" className={cx('flex w-full max-w-sm flex-col gap-3 rounded-3xl p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="neu-inset grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-xs font-bold text-[color:var(--neu-accent)]">
            {fileExtension}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-xs font-bold text-[color:var(--neu-text)]">{fileName}</span>
            <span className="font-mono text-[10px] text-[color:var(--neu-text-faint)]">{fileSize}</span>
          </span>
        </div>
        {completed && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
      </div>

      {progress > 0 && !completed && (
        <div>
          <div className="mb-1 flex justify-between font-mono text-[10px] text-[color:var(--neu-text-muted)]">
            <span>Téléchargement…</span>
            <span className="font-bold text-[color:var(--neu-accent)]">{Math.round(progress)} %</span>
          </div>
          <div className="neu-inset h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #ff8c42, var(--neu-accent))',
              }}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onDownload}
        className="neu-flat-sm min-h-8 cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold text-[color:var(--neu-text)] transition-colors hover:text-[color:var(--neu-accent)]"
      >
        {completed ? 'Télécharger à nouveau' : 'Télécharger'}
      </button>
    </Panel>
  )
}
