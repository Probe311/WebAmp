/**
 * URLs constructeur partagées par les lots de recherche.
 *
 * Les helpers ne valent que pour les constructeurs dont le schéma d'URL est
 * stable et vérifié ; ailleurs les fiches portent l'URL littérale, avec
 * `urlDoubt` quand elle est déduite d'un motif.
 */

export const BOSS = (slug: string) => `https://www.boss.info/global/products/${slug}`
export const EHX = (slug: string) => `https://www.ehx.com/products/${slug}/`
export const EQD = (slug: string) => `https://www.earthquakerdevices.com/${slug}`
export const STRYMON = (slug: string) => `https://www.strymon.net/product/${slug}`

/** Pages gamme réutilisées par plusieurs modèles. */
export const WALRUS_FUNDAMENTAL = 'https://www.walrusaudio.com/collections/fundamental-series'
export const CHASE_PEDALS = 'https://www.chasebliss.com/pedals'

/** Libellés de doute, partagés pour rester cohérents dans la doc. */
export const DOUBT_WIKI = 'source encyclopédique (Wikipedia), pas une fiche constructeur'
