/**
 * Composants de graphiques pour la section Analytics de l'admin
 */
import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { AnalyticsStats } from '../../services/analytics'

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899']

// URL de la carte du monde TopoJSON (format 110m pour meilleures performances)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface AnalyticsChartsProps {
  stats: AnalyticsStats
}

// Mapping des noms de pays vers leurs codes ISO-3166-1 alpha-3
const countryToISO: Record<string, string> = {
  'United States': 'USA',
  'France': 'FRA',
  'United Kingdom': 'GBR',
  'Germany': 'DEU',
  'Spain': 'ESP',
  'Italy': 'ITA',
  'Brazil': 'BRA',
  'Canada': 'CAN',
  'Australia': 'AUS',
  'Japan': 'JPN',
  'China': 'CHN',
  'India': 'IND',
  'Russia': 'RUS',
  'South Korea': 'KOR',
  'Mexico': 'MEX',
  'Netherlands': 'NLD',
  'Belgium': 'BEL',
  'Switzerland': 'CHE',
  'Sweden': 'SWE',
  'Norway': 'NOR',
  'Denmark': 'DNK',
  'Finland': 'FIN',
  'Poland': 'POL',
  'Portugal': 'PRT',
  'Greece': 'GRC',
  'Turkey': 'TUR',
  'Argentina': 'ARG',
  'Chile': 'CHL',
  'Colombia': 'COL',
  'Peru': 'PER',
  'South Africa': 'ZAF',
  'Egypt': 'EGY',
  'Saudi Arabia': 'SAU',
  'United Arab Emirates': 'ARE',
  'Israel': 'ISR',
  'Thailand': 'THA',
  'Vietnam': 'VNM',
  'Indonesia': 'IDN',
  'Malaysia': 'MYS',
  'Singapore': 'SGP',
  'Philippines': 'PHL',
  'New Zealand': 'NZL',
  'Ireland': 'IRL',
  'Austria': 'AUT',
  'Czech Republic': 'CZE',
  'Romania': 'ROU',
  'Hungary': 'HUN',
  'Ukraine': 'UKR',
  'Unknown': ''
}

// Composant de conteneur uniforme pour tous les graphiques
const ChartContainer: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
    {children}
  </div>
)

/**
 * Carte du monde interactive des sessions par pays
 */
export function SessionsWorldMap({ stats }: AnalyticsChartsProps) {
  const [tooltipContent, setTooltipContent] = useState<string>('')
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const countryData = Object.entries(stats.sessionsByCountry || {})
    .map(([country, count]) => ({ 
      country, 
      sessions: count,
      iso: countryToISO[country] || ''
    }))
    .filter(item => item.sessions > 0)

  if (countryData.length === 0) {
    return (
      <ChartContainer title="Sessions par pays">
        <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
      </ChartContainer>
    )
  }

  // Trouver le maximum pour la normalisation des couleurs
  const maxSessions = Math.max(...countryData.map(d => d.sessions))
  
  // Créer un map pour accès rapide
  const countryMap = new Map(countryData.map(d => [d.iso, d.sessions]))

  const getFillColor = (iso: string) => {
    if (!iso || !countryMap.has(iso)) {
      return '#e5e7eb' // Gris pour les pays sans données
    }
    const sessions = countryMap.get(iso) || 0
    const intensity = sessions / maxSessions
    // Gradient du rouge clair au rouge foncé
    if (intensity > 0.7) return '#dc2626' // Rouge foncé
    if (intensity > 0.4) return '#ef4444' // Rouge moyen
    if (intensity > 0.2) return '#f87171' // Rouge clair
    return '#fca5a5' // Rouge très clair
  }

  return (
    <ChartContainer title="Sessions par pays">
      <div className="relative w-full" style={{ minHeight: '500px' }}>
        {mapError ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-center">
              <p className="text-red-500 dark:text-red-400 mb-2">Erreur de chargement de la carte</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{mapError}</p>
            </div>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg z-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chargement de la carte...</p>
                </div>
              </div>
            )}
            <div className="w-full" style={{ height: '500px', position: 'relative' }}>
              <ComposableMap
                projectionConfig={{
                  scale: 147,
                  center: [0, 20]
                }}
                style={{ width: '100%', height: '100%' }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }: { geographies: any[] }) => {
                    if (isLoading) {
                      setIsLoading(false)
                    }
                    if (!geographies || geographies.length === 0) {
                      if (!mapError) {
                        setMapError('Aucune donnée géographique disponible')
                      }
                      return null
                    }
                    return geographies.map((geo: any) => {
                      const iso = geo.properties.ISO_A3 || geo.properties.ISO_A2 || ''
                      const sessions = countryMap.get(iso) || 0
                      const isHovered = hoveredCountry === iso
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getFillColor(iso)}
                          stroke="#ffffff"
                          strokeWidth={0.5}
                          style={{
                            default: {
                              outline: 'none',
                              opacity: isHovered ? 1 : 0.8
                            },
                            hover: {
                              outline: 'none',
                              opacity: 1,
                              cursor: 'pointer',
                              fill: getFillColor(iso)
                            },
                            pressed: {
                              outline: 'none'
                            }
                          }}
                          onMouseEnter={() => {
                            const countryName = geo.properties.NAME || geo.properties.NAME_LONG || geo.properties.NAME_EN || 'Unknown'
                            setTooltipContent(`${countryName}: ${sessions} session${sessions !== 1 ? 's' : ''}`)
                            setHoveredCountry(iso)
                          }}
                          onMouseLeave={() => {
                            setTooltipContent('')
                            setHoveredCountry(null)
                          }}
                        />
                      )
                    })
                  }}
                </Geographies>
              </ComposableMap>
            </div>
            
            {/* Tooltip */}
            {tooltipContent && (
              <div className="absolute top-4 left-4 bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 rounded-lg shadow-lg text-sm z-10 pointer-events-none">
                {tooltipContent}
              </div>
            )}

            {/* Légende */}
            <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Intensité</div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fca5a5' }}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Faible</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f87171' }}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Moyen</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Élevé</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Très élevé</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ChartContainer>
  )
}

/**
 * Graphique en barres pour les pays
 */
export function CountriesBarChart({ stats }: AnalyticsChartsProps) {
  const countryData = Object.entries(stats.sessionsByCountry || {})
    .map(([country, count]) => ({ country, sessions: count }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10)

  if (countryData.length === 0) {
    return (
      <ChartContainer title="Top 10 pays">
        <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer title="Top 10 pays">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={countryData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis 
            dataKey="country" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            className="dark:text-gray-400"
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            className="dark:text-gray-400"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

/**
 * Courbes d'évolution temporelle
 */
export function EvolutionLineChart({ stats }: AnalyticsChartsProps) {
  const evolutionData = stats.evolutionData || []

  if (evolutionData.length === 0) {
    return (
      <ChartContainer title="Évolution temporelle">
        <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
      </ChartContainer>
    )
  }

  // Formater les dates pour l'affichage
  const formattedData = evolutionData.map(item => ({
    ...item,
    dateFormatted: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  }))

  return (
    <ChartContainer title="Évolution temporelle">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis 
            dataKey="dateFormatted"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            className="dark:text-gray-400"
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            className="dark:text-gray-400"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line type="monotone" dataKey="sessions" stroke="#ef4444" name="Sessions" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="pageViews" stroke="#3b82f6" name="Pages vues" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="users" stroke="#22c55e" name="Utilisateurs" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

/**
 * Camembert pour les devices
 */
export function DevicesPieChart({ stats }: AnalyticsChartsProps) {
  const deviceData = Object.entries(stats.sessionsByDevice || {})
    .map(([device, count]) => ({ name: device, value: count }))
    .sort((a, b) => b.value - a.value)

  if (deviceData.length === 0) {
    return (
      <ChartContainer title="Répartition par device">
        <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
      </ChartContainer>
    )
  }

  const total = deviceData.reduce((sum, item) => sum + item.value, 0)

  return (
    <ChartContainer title="Répartition par device">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={deviceData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => `${props.name || ''}: ${((props.percent || 0) * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {deviceData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number | undefined) => [`${value || 0} (${(((value || 0) / total) * 100).toFixed(1)}%)`, 'Sessions']}
            contentStyle={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

/**
 * Camembert pour les navigateurs
 */
export function BrowsersPieChart({ stats }: AnalyticsChartsProps) {
  const browserData = Object.entries(stats.sessionsByBrowser || {})
    .map(([browser, count]) => ({ name: browser, value: count }))
    .sort((a, b) => b.value - a.value)

  if (browserData.length === 0) {
    return (
      <ChartContainer title="Répartition par navigateur">
        <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
      </ChartContainer>
    )
  }

  const total = browserData.reduce((sum, item) => sum + item.value, 0)

  return (
    <ChartContainer title="Répartition par navigateur">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={browserData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => `${props.name || ''}: ${((props.percent || 0) * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {browserData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number | undefined) => [`${value || 0} (${(((value || 0) / total) * 100).toFixed(1)}%)`, 'Sessions']}
            contentStyle={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

/**
 * Camembert pour les OS
 */
export function OSPieChart({ stats }: AnalyticsChartsProps) {
  const osData = Object.entries(stats.sessionsByOS || {})
    .map(([os, count]) => ({ name: os, value: count }))
    .sort((a, b) => b.value - a.value)

  if (osData.length === 0) {
    return (
      <ChartContainer title="Répartition par OS">
        <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
      </ChartContainer>
    )
  }

  const total = osData.reduce((sum, item) => sum + item.value, 0)

  return (
    <ChartContainer title="Répartition par OS">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={osData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => `${props.name || ''}: ${((props.percent || 0) * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {osData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number | undefined) => [`${value || 0} (${(((value || 0) / total) * 100).toFixed(1)}%)`, 'Sessions']}
            contentStyle={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

