import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Button, IconButton, Input, RangeSlider, RotaryKnob } from '../index'

describe('Button', () => {
  it('rend son libellé et déclenche onClick', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Sauvegarder</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('en chargement : désactivé et annoncé occupé', () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Sauvegarder
      </Button>
    )

    const button = screen.getByRole('button', { name: /Sauvegarder/ })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')

    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('IconButton', () => {
  it('expose son nom accessible et son état pressé', () => {
    render(
      <IconButton label="Mute" pressed>
        <span>M</span>
      </IconButton>
    )

    const button = screen.getByRole('button', { name: 'Mute' })
    expect(button).toHaveAttribute('title', 'Mute')
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Input', () => {
  it('relie le label au champ', () => {
    render(<Input label="Email" defaultValue="a@b.c" />)

    expect(screen.getByLabelText('Email')).toHaveValue('a@b.c')
  })

  it('signale une erreur en ARIA et remplace l’aide', () => {
    render(<Input label="Email" hint="Aide" error="Adresse invalide" />)

    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Adresse invalide')
    expect(screen.queryByText('Aide')).not.toBeInTheDocument()

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Adresse invalide')
    expect(input.getAttribute('aria-describedby')).toBe(alert.id)
  })
})

describe('RangeSlider', () => {
  it('passe la valeur numérique à onChange et expose ses bornes', () => {
    const onChange = vi.fn()
    render(
      <RangeSlider label="Volume" value={10} min={0} max={11} step={1} onChange={onChange} />
    )

    const slider = screen.getByRole('slider', { name: 'Volume' })
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '11')

    fireEvent.change(slider, { target: { value: '7' } })
    expect(onChange).toHaveBeenCalledWith(7)
  })

  it('affiche la valeur formatée quand demandé', () => {
    render(
      <RangeSlider
        label="Gain"
        value={5.5}
        showValue
        formatValue={(v) => `${v.toFixed(1)} dB`}
        onChange={() => {}}
      />
    )

    expect(screen.getByText('5.5 dB')).toBeInTheDocument()
  })
})

describe('RotaryKnob', () => {
  it('incrémente au clavier et borne à la valeur maximale', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <RotaryKnob label="Gain" value={5} min={0} max={10} step={0.5} onChange={onChange} />
    )

    const knob = screen.getByRole('slider', { name: 'Gain' })
    expect(knob).toHaveAttribute('aria-valuenow', '5')
    expect(knob).toHaveAttribute('aria-valuetext', '5.0')

    fireEvent.keyDown(knob, { key: 'ArrowUp' })
    expect(onChange).toHaveBeenLastCalledWith(5.5)

    fireEvent.keyDown(knob, { key: 'PageDown' })
    expect(onChange).toHaveBeenLastCalledWith(0)

    // Au maximum, une flèche haute ne doit rien émettre : la valeur est bornée.
    rerender(<RotaryKnob label="Gain" value={10} min={0} max={10} step={0.5} onChange={onChange} />)
    const callsBefore = onChange.mock.calls.length
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Gain' }), { key: 'ArrowUp' })
    expect(onChange).toHaveBeenCalledTimes(callsBefore)
  })

  it('revient à la valeur par défaut au double-clic', () => {
    const onChange = vi.fn()
    render(
      <RotaryKnob label="Mix" value={9} min={0} max={10} step={1} defaultValue={5} onChange={onChange} />
    )

    fireEvent.doubleClick(screen.getByRole('slider', { name: 'Mix' }))
    expect(onChange).toHaveBeenCalledWith(5)
  })
})
