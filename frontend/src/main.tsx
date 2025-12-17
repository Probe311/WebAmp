import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './styles/animations.css'
import './styles/neumorphic-design-system.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { DrumMachineProvider } from './contexts/DrumMachineContext'
import { ToastProvider } from './components/notifications/ToastProvider'
import { KeyboardShortcutsProvider } from './contexts/KeyboardShortcutsContext'
import { AppWithAuth } from './auth/AppWithAuth'
import { Loader } from './components/Loader'

// Importer les helpers de migration pour les exposer globalement
import './utils/migrationHelper'
// Importer le script principal d'import des cours
import './scripts/importCourses'
// Importer le script de nettoyage des doublons
import './scripts/cleanDuplicateCourses'
// Importer le script de mise à jour des tablatures Shake It Off
import './scripts/updateShakeItOffTablatures'
// Importer le script d'import des tablatures depuis HTML
import './scripts/importShakeItOffTabs'

// Lazy loading pour temps de chargement < 1s
const App = lazy(() => import('./App').then(module => ({ default: module.default })))

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

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <DrumMachineProvider>
        <KeyboardShortcutsProvider>
          <ToastProvider>
            <AppWithAuth>
              <Suspense fallback={<Loader size="lg" className="h-screen" />}>
                <App />
              </Suspense>
            </AppWithAuth>
          </ToastProvider>
        </KeyboardShortcutsProvider>
      </DrumMachineProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

