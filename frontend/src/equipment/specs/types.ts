/**
 * Contrat d'une fiche de recherche web, partagé par tous les lots.
 *
 * Isolé dans son propre module pour que `research.ts` (L1–L3) et
 * `research-l4.ts` (L4) n'aient aucune dépendance croisée.
 */
import type {
  EnclosureTexture,
  EquipmentColorId,
  EquipmentFinish,
  EquipmentMaterial,
  IndicatorStyle,
  KnobAppearance,
  LedColor,
  PedalArchetype,
} from '../types'

export interface PedalResearch {
  url?: string
  color?: EquipmentColorId
  /** Teinte exacte relevée sur la photo (prime sur le token). */
  customHex?: string
  texture?: EnclosureTexture
  finish?: EquipmentFinish
  material?: EquipmentMaterial
  knob?: KnobAppearance
  indicator?: IndicatorStyle
  /** `null` = pas de LED sur la pédale d'origine. */
  led?: LedColor | null
  /** Position du témoin relevée sur la photo (sinon gabarit de la gamme). */
  ledPlacement?: { x: number; y: number }
  foot?: 'footswitch' | 'stomp-pad'
  chassis?: PedalArchetype
  /** Libellés sérigraphiés réels, par id de paramètre audio. */
  labels?: Record<string, string>
  /** Sous-échelle sérigraphiée de chaque knob (MIN/MAX par défaut). */
  knobScales?: Record<string, { left: string; right: string }>
  /**
   * Force la présentation des paramètres en knobs. Utile quand le type de
   * pédale impose des faders dans les données mais que le modèle réel est à
   * potentiomètres (ParaEQ, Condor). Les ids audio restent inchangés.
   */
  controlKind?: 'knobs'
  /**
   * Placement imposé des contrôles (id audio → centre en % du canevas + taille
   * en px), relevé sur la photo du modèle. Les ids restent inchangés.
   */
  placements?: Record<string, { x: number; y: number; size?: number; width?: number }>
  /** Ligne de gamme sérigraphiée sur la plaque (« ULTRA TREMOLO »). */
  series?: string
  /** Mention latérale de la façade (« DIR OUT »). */
  sideNote?: string
  /** Pictogrammes de forme d'onde sous le potentiomètre central (trémolo). */
  waveGlyphs?: boolean
  /** Bloc accordeur sérigraphié (écran de note, échelle PITCH). */
  tunerDisplay?: boolean
  /** Bloc de commandes dans la couleur du boîtier au lieu du noir (EQ doré). */
  faceTone?: 'body'
  /** Faders sombres, sans piste ni témoin colorés (EQ graphique doré). */
  faderTone?: 'dark'
  /** Sélecteur d'options vertical, façon glissière crantée (Ultra Vibrato). */
  verticalSelector?: boolean
  /**
   * Sélecteurs horizontaux compacts (barre + libellés réduits), pour aligner
   * plusieurs rangées côte à côte sur la façade (Tube Amp Modeler).
   */
  denseSelectors?: boolean
  /**
   * Sélecteur rotatif cranté (molette FX) au lieu d'une barre horizontale :
   * libellés dessinés par l'habillage autour du bouton (Digital Multi-FX).
   */
  rotarySelector?: boolean
  /** Nature de l'URL : fiche modèle, page gamme, ou aucune (vintage/maison). */
  urlKind?: 'model' | 'brand' | 'none'
  /** Modèle conçu par WebAmp : aucune fiche constructeur externe. */
  house?: boolean
  note?: string
  /**
   * Doute documenté sur l'URL : motif reconstruit plutôt que page vérifiée,
   * page d'accueil au lieu de la fiche produit, produit discontinué, ou
   * fiche d'un modèle voisin. Affiché dans `docs/EQUIPMENT_REFERENCE.md`.
   */
  urlDoubt?: string
}
