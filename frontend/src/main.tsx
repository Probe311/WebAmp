import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './styles/animations.css'
import './styles/neu-tokens.css'
import './styles/tones-tokens.css'
import './styles/tones-primitives.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { DrumMachineProvider } from './contexts/DrumMachineContext'
import { ToastProvider } from './components/notifications/ToastProvider'
import { KeyboardShortcutsProvider } from './contexts/KeyboardShortcutsContext'
import { AppWithAuth } from './auth/AppWithAuth'
// Lazy loading pour temps de chargement < 1s
const App = lazy(() => import('./App').then(module => ({ default: module.default })))
const PedalsDemoPage = lazy(() =>
  import('./pages/PedalsDemoPage').then(module => ({ default: module.PedalsDemoPage }))
)
const EquipmentDemoPage = lazy(() =>
  import('./pages/EquipmentDemoPage').then(module => ({ default: module.EquipmentDemoPage }))
)

/** Fond neutre pendant le chunk — le Loader « webamp » ne vit que dans App. */
function ChunkFallback() {
  return <div className="neu-bg h-screen w-screen" aria-busy="true" />
}

// Gérer le hot reload en réutilisant le root existant
const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

// Vérifier si un root existe déjà (pour le hot reload de Vite)
let root = (window as any).__reactRoot
if (!root) {
  root = ReactDOM.createRoot(container)
  // Stocker la référence pour le hot reload
  ;(window as any).__reactRoot = root
}

const isPedalsDemo = window.location.hash === '#pedals-demo'
const isEquipmentDemo = window.location.hash === '#equipment-demo'

root.render(
  <React.StrictMode>
    <ThemeProvider>
      {isPedalsDemo ? (
        <Suspense fallback={<ChunkFallback />}>
          <PedalsDemoPage />
        </Suspense>
      ) : isEquipmentDemo ? (
        <Suspense fallback={<ChunkFallback />}>
          <EquipmentDemoPage />
        </Suspense>
      ) : (
        <DrumMachineProvider>
          <KeyboardShortcutsProvider>
            <ToastProvider>
              <AppWithAuth>
                <Suspense fallback={<ChunkFallback />}>
                  <App />
                </Suspense>
              </AppWithAuth>
            </ToastProvider>
          </KeyboardShortcutsProvider>
        </DrumMachineProvider>
      )}
    </ThemeProvider>
  </React.StrictMode>,
)

