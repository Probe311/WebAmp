import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './styles/animations.css'
import './styles/neumorphic-design-system.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { DrumMachineProvider } from './contexts/DrumMachineContext'
import { ToastProvider } from './components/notifications/ToastProvider'
import { KeyboardShortcutsProvider } from './contexts/KeyboardShortcutsContext'
import { AppWithAuth } from './beta/auth/AppWithAuth'

// Lazy loading pour temps de chargement < 1s
const App = lazy(() => import('./App.tsx'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <DrumMachineProvider>
        <KeyboardShortcutsProvider>
          <ToastProvider>
            <AppWithAuth>
              <Suspense fallback={<div className="flex items-center justify-center h-screen">Chargement...</div>}>
                <App />
              </Suspense>
            </AppWithAuth>
          </ToastProvider>
        </KeyboardShortcutsProvider>
      </DrumMachineProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

