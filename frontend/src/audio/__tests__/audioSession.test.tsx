import { describe, it, expect, beforeEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { AudioSessionProvider, useAudioSession } from '../AudioSessionContext'
import {
  getSharedEngine,
  getEngineCreationCount,
  peekSharedEngine,
  resetSharedEngine
} from '../audioSession'

function AddEffectProbe() {
  const { effects, setEffects } = useAudioSession()
  return (
    <div>
      <span data-testid="effect-count">{effects.length}</span>
      <button
        data-testid="add-effect"
        onClick={() =>
          setEffects(prev => [
            ...prev,
            {
              id: `effect-${prev.length}`,
              type: 'overdrive',
              pedalId: 'test-pedal',
              name: 'Test Pedal',
              bypassed: false,
              parameters: {}
            }
          ])
        }
      >
        Ajouter
      </button>
    </div>
  )
}

describe('session audio', () => {
  beforeEach(() => {
    cleanup()
    resetSharedEngine()
  })

  it('instancie un seul moteur, même appelé plusieurs fois (StrictMode inclus)', () => {
    const before = getEngineCreationCount()

    const first = getSharedEngine()
    const second = getSharedEngine()

    expect(second).toBe(first)
    expect(getEngineCreationCount() - before).toBe(1)
  })

  it('ne recrée un moteur qu\'après une remise à zéro explicite', () => {
    const first = getSharedEngine()
    resetSharedEngine()

    expect(peekSharedEngine()).toBeNull()

    const second = getSharedEngine()
    expect(second).not.toBe(first)
    expect(peekSharedEngine()).toBe(second)
  })

  it('conserve les effets quand la fenêtre consommatrice est fermée puis rouverte', () => {
    const { getByTestId, rerender } = render(
      <AudioSessionProvider>
        <AddEffectProbe />
      </AudioSessionProvider>
    )

    fireEvent.click(getByTestId('add-effect'))
    fireEvent.click(getByTestId('add-effect'))
    expect(getByTestId('effect-count').textContent).toBe('2')

    const engineWhileOpen = peekSharedEngine()

    // Fermeture de la fenêtre : le contenu est démonté, le provider (session) reste
    rerender(
      <AudioSessionProvider>
        <div data-testid="closed" />
      </AudioSessionProvider>
    )
    expect(getByTestId('closed')).toBeTruthy()

    // Réouverture de la fenêtre
    rerender(
      <AudioSessionProvider>
        <AddEffectProbe />
      </AudioSessionProvider>
    )

    expect(getByTestId('effect-count').textContent).toBe('2')
    expect(peekSharedEngine()).toBe(engineWhileOpen)
    expect(engineWhileOpen).not.toBeNull()
  })

  it('ne détruit pas le moteur au démontage du provider', () => {
    const engine = getSharedEngine()
    const { unmount } = render(
      <AudioSessionProvider>
        <AddEffectProbe />
      </AudioSessionProvider>
    )

    unmount()

    expect(peekSharedEngine()).toBe(engine)
  })
})
