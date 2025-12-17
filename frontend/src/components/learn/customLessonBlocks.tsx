import { ReactNode } from 'react'

/**
 * Registre de contenus "riches" personnalisés pour les leçons.
 *
 * Utilisation côté contenu :
 *  - Dans la description d'une étape de tutoriel, ajoute par exemple :
 *      "[block:solo-intro-diagram]"
 *  - `TutorialContentRenderer` détecte ce tag et viendra rendre ici le bloc
 *    correspondant.
 *
 * Pour ajouter un nouveau bloc :
 *  1. Choisir un identifiant stable (ex: "solo-intro-diagram")
 *  2. Ajouter une entrée dans `customLessonBlocks` avec cet id
 *  3. Coller le HTML/SVG fourni dans le JSX du bloc
 *  4. Référencer le bloc dans la description de l'étape via `[block:solo-intro-diagram]`
 */

export const customLessonBlocks: Record<string, ReactNode> = {
  // Exemple : bloc de démo
  example_demo_block: (
    <div className="mt-4 rounded-lg border border-orange-500/30 bg-orange-500/5 p-4 text-sm text-black/80 dark:text-white/80">
      <p className="font-semibold mb-1">Bloc de contenu personnalisé</p>
      <p className="text-xs opacity-80">
        Remplace ce bloc par ton code HTML/SVG réel dans
        {' '}
        <code>customLessonBlocks.tsx</code>
        , puis référence-le dans la description avec
        {' '}
        <code>[block:example_demo_block]</code>.
      </p>
    </div>
  ),

  /**
   * Exemple de point d’ancrage pour ton diagramme HTML/SVG réel.
   * Remplace le contenu du <div> ci-dessous par le code que tu m'as fourni
   * (SVG, paths, etc.) pour l’intégrer dans les cours.
   *
   * Référence dans une étape de tutoriel :
   *   "... texte de la leçon ...
   *    [block:solo_intro_svg]
   *    ... suite du texte ..."
   */
  solo_intro_svg: (
    <div className="mt-6 overflow-x-auto">
      {/* TODO: colle ici ton HTML/SVG complet pour le diagramme de solo */}
    </div>
  ),
}


