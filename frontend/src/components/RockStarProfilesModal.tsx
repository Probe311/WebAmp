import { useState, useEffect, useMemo } from 'react'
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import { rockStarProfiles } from '../data/rockStarProfiles'
import { Modal } from './Modal'

interface RockStarProfilesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectProfile: (profileName: string) => void
}

export function RockStarProfilesModal({ 
  isOpen, 
  onClose, 
  onSelectProfile
}: RockStarProfilesModalProps) {
  const [customProfiles, setCustomProfiles] = useState<typeof rockStarProfiles>([])
  const [search, setSearch] = useState('')
  const [styleFilter, setStyleFilter] = useState('all')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    // Charger les profils sauvegardés depuis localStorage
    try {
      const saved = localStorage.getItem('webamp_custom_profiles')
      if (saved) {
        setCustomProfiles(JSON.parse(saved))
      }
    } catch (error) {
      // échec silencieux du chargement des profils
    }
  }, [])

  const handleSelectProfile = (profileName: string) => {
    onSelectProfile(profileName)
    onClose()
  }

  const allProfiles = useMemo(() => [...rockStarProfiles, ...customProfiles], [customProfiles])

  // Regroupement des styles en familles pour simplifier la sélection
  const styleFamilies = useMemo(() => {
    const toFamily = (style: string) => {
      const s = style.toLowerCase()
      if (s.includes('metal') || s.includes('djent')) return 'Metal / Hard'
      if (s.includes('hard rock') || s.includes('rock') && !s.includes('pop') && !s.includes('funk')) return 'Rock'
      if (s.includes('blues')) return 'Blues'
      if (s.includes('jazz')) return 'Jazz / Fusion'
      if (s.includes('funk') || s.includes('disco')) return 'Funk / Disco'
      if (s.includes('pop')) return 'Pop / Variété'
      if (s.includes('fusion')) return 'Fusion'
      if (s.includes('instrumental')) return 'Instrumental'
      return 'Autres'
    }

    const grouped = allProfiles.reduce<Record<string, Set<string>>>((acc, profile) => {
      const fam = toFamily(profile.style)
      if (!acc[fam]) acc[fam] = new Set()
      acc[fam].add(profile.style)
      return acc
    }, {})

    // Transformer en liste triée
    return Object.entries(grouped)
      .map(([family, styles]) => ({ family, styles: Array.from(styles).sort() }))
      .sort((a, b) => a.family.localeCompare(b.family))
  }, [allProfiles])

  const filteredProfiles = useMemo(() => {
    const term = search.trim().toLowerCase()
    const filtered = allProfiles.filter((profile) => {
      const matchesSearch =
        term.length === 0 ||
        profile.name.toLowerCase().includes(term) ||
        profile.style.toLowerCase().includes(term) ||
        profile.amps.some((a) => a.toLowerCase().includes(term)) ||
        profile.pedals.some((p) => p.toLowerCase().includes(term))

      const matchesStyle = styleFilter === 'all' || profile.style === styleFilter

      return matchesSearch && matchesStyle
    })
    return filtered.sort((a, b) =>
      sortDir === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
  }, [allProfiles, search, styleFilter, sortDir])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profils"
      bodyClassName="overflow-y-auto custom-scrollbar max-h-[calc(85vh-80px)] p-4"
      headerRight={(
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un artiste, un ampli ou une pédale..."
            className="min-w-[260px] px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-black/10 dark:border-white/10 text-sm text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-150"
          />
          <select
            value={styleFilter}
            onChange={(e) => setStyleFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-black/10 dark:border-white/10 text-sm text-black/80 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-150"
          >
            <option key="all" value="all">Tous les styles</option>
            {styleFamilies.map(({ family, styles }) => (
              <optgroup key={family} label={family}>
                {styles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSortDir((prev) => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-black/10 dark:border-white/10 text-black/80 dark:text-white/80 hover:border-cyan-500/60 hover:text-cyan-500 dark:hover:text-cyan-300 transition-all duration-150 flex items-center justify-center"
            title={`Tri ${sortDir === 'asc' ? 'A-Z' : 'Z-A'}`}
          >
            {sortDir === 'asc' ? <ArrowDownAZ size={20} /> : <ArrowUpAZ size={20} />}
          </button>
        </div>
      )}
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 py-4">
        {filteredProfiles.map((profile) => (
          <button
            key={profile.name}
            onClick={() => handleSelectProfile(profile.name)}
            className="bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-lg p-5 cursor-pointer transition-all duration-300 text-left text-black/85 dark:text-white/85"
            style={{
              boxShadow: document.documentElement.classList.contains('dark')
                ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                ? '3px 3px 6px rgba(0, 0, 0, 0.6), -3px -3px 6px rgba(70, 70, 70, 0.6)'
                : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 1)'
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.backgroundColor = document.documentElement.classList.contains('dark')
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.backgroundColor = document.documentElement.classList.contains('dark')
                ? '#1f2937'
                : '#ffffff'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
                : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.5)'
              e.currentTarget.style.transform = 'scale(0.98)'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <div className="mb-4 pb-3 border-b border-black/10 dark:border-white/10">
              <h3 className="text-xl font-bold m-0 mb-2 text-black/90 dark:text-white/90">{profile.name}</h3>
              <span className="text-xs text-black/60 dark:text-white/60 uppercase tracking-[1px]">{profile.style}</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold m-0 text-black/80 dark:text-white/80 uppercase tracking-[0.5px]">Amplis</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.amps.map((amp, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-600 dark:text-orange-400">{amp}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold m-0 text-black/80 dark:text-white/80 uppercase tracking-[0.5px]">Pédales</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.pedals.map((pedal, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-600 dark:text-cyan-400">{pedal}</span>
                  ))}
                </div>
              </div>
              {profile.notes && (
                <p className="text-xs text-black/60 dark:text-white/60 italic m-0 mt-2 leading-relaxed">{profile.notes}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </Modal>
  )
}
