/**
 * TabViewer Component
 * 
 * Composant pour l'affichage de tablatures et notation musicale
 * Utilise VexFlow pour la visualisation de tablatures
 * Support format ABC via abcjs
 * 
 * Section : "6. Apprentissage et Pédagogie (Learn)"
 */

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from './Loader';
import { tablatureToABC, abcToTablature, validateABC } from '../utils/abcConverter';

// Types pour les tablatures
export interface TabNote {
  string: number;  // 1-6 pour guitare
  fret: number;
  duration?: string;  // "q" (quarter), "8" (eighth), etc.
}

export interface TabMeasure {
  notes: TabNote[];
  timeSignature?: string;  // "4/4", "3/4", etc.
}

export interface Tablature {
  title?: string;
  artist?: string;
  measures: TabMeasure[];
  tuning?: string[];  // ["E", "A", "D", "G", "B", "E"]
}

interface TabViewerProps {
  tablature?: Tablature;
  presetId?: string;
  width?: number;
  height?: number;
  showControls?: boolean;
  onExport?: (format: 'svg' | 'png' | 'pdf') => void;
}

export const TabViewer: React.FC<TabViewerProps> = ({
  tablature,
  presetId,
  width = 800,
  height = 600,
  showControls = true,
  onExport,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [renderTablature, setRenderTablature] = useState<Tablature | null>(null);
  const [abcText, setAbcText] = useState<string>('');
  const [abcError, setAbcError] = useState<string | null>(null);

  // Mettre à jour la tablature rendue et l'ABC lorsqu'on reçoit une nouvelle tablature en props
  useEffect(() => {
    if (tablature) {
      setRenderTablature(tablature);
      try {
        const abc = tablatureToABC(tablature);
        setAbcText(abc);
        setAbcError(null);
      } catch (err) {
        // Échec silencieux de la conversion, l'UI continue à fonctionner
      }
    } else {
      setRenderTablature(null);
      setAbcText('');
      setAbcError(null);
    }
  }, [tablature]);

  useEffect(() => {
    if (!containerRef.current || !renderTablature) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Créer le renderer VexFlow
      // @ts-ignore - VexFlow est chargé dynamiquement
      const { Renderer, Stave, StaveNote, Voice, Formatter } = (window as any).Vex?.Flow || {};

      // Nettoyer le conteneur
      containerRef.current.innerHTML = '';

      // Créer le renderer
      const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
      renderer.resize(width, height);
      const context = renderer.getContext();
      rendererRef.current = renderer;

      // Configuration par défaut
      const tuning = renderTablature.tuning || ['E', 'A', 'D', 'G', 'B', 'E'];
      const staveWidth = width - 100;
      let yPosition = 50;

      // Titre et artiste
      if (renderTablature.title || renderTablature.artist) {
        context.setFont('Arial', 16, 'bold');
        context.fillStyle = '#000';
        const titleText = renderTablature.title || '';
        const artistText = renderTablature.artist ? ` - ${renderTablature.artist}` : '';
        context.fillText(titleText + artistText, 50, yPosition);
        yPosition += 40;
      }

      // Créer les staves (portées) pour chaque mesure
      renderTablature.measures.forEach((measure) => {
        const stave = new Stave(50, yPosition, staveWidth);
        
        // Time signature
        if (measure.timeSignature) {
          const [beats, beatType] = measure.timeSignature.split('/');
          stave.setTimeSignature(beats, beatType);
        }

        stave.setContext(context).draw();

        // Créer les notes
        const notes = measure.notes.map(note => {
          const staveNote = new StaveNote({
            clef: 'treble',
            keys: [`${tuning[note.string - 1]}/${note.fret}`],
            duration: note.duration || 'q',
          });

          // Ajouter les frets sur la tablature
          // @ts-ignore - VexFlow est chargé dynamiquement
          const VexFlow = (window as any).Vex?.Flow;
          if (VexFlow?.TabNote) {
            staveNote.addModifier(0, new VexFlow.TabNote({ fret: note.fret }), 0);
          }

          return staveNote;
        });

        // Créer la voix
        const voice = new Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables(notes);

        // Formatter
        new Formatter().joinVoices([voice]).format([voice], staveWidth - 100);

        voice.draw(context, stave);

        yPosition += 120; // Espacement entre les mesures
      });

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render tablature');
      setIsLoading(false);
    }
  }, [renderTablature, width, height]);

  const handleExport = (format: 'svg' | 'png' | 'pdf') => {
    if (onExport) {
      onExport(format);
    } else {
      // Export par défaut
      if (rendererRef.current && format === 'svg') {
        const svg = containerRef.current?.querySelector('svg');
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const blob = new Blob([svgData], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `tablature-${presetId || 'export'}.svg`;
          link.click();
          URL.revokeObjectURL(url);
        }
      }
    }
  };

  if (!renderTablature) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <p>Aucune tablature disponible</p>
      </div>
    );
  }

  return (
    <div className="tab-viewer space-y-4">
      {showControls && (
        <div className="space-y-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('svg')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Export SVG
              </button>
              <button
                onClick={() => handleExport('png')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Export PNG
              </button>
            </div>
          </div>

          {/* Éditeur ABC simple pour import/export */}
          <div className="mt-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
              Représentation ABC (expérimental)
            </label>
            <textarea
              value={abcText}
              onChange={(e) => {
                setAbcText(e.target.value);
                setAbcError(null);
              }}
              className="w-full h-32 text-xs font-mono rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-2 resize-y"
              spellCheck={false}
            />
            {abcError && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {abcError}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!renderTablature) return;
                  try {
                    const abc = tablatureToABC(renderTablature);
                    setAbcText(abc);
                    setAbcError(null);
                  } catch (err) {
                    setAbcError('Erreur lors de la conversion de la tablature en ABC.');
                  }
                }}
                className="px-3 py-1.5 text-xs rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
              >
                Actualiser depuis la tablature
              </button>
              <button
                type="button"
                onClick={() => {
                  const result = validateABC(abcText);
                  if (!result.valid) {
                    setAbcError(result.error || 'ABC invalide.');
                    return;
                  }
                  try {
                    const tuning = renderTablature?.tuning || ['E', 'A', 'D', 'G', 'B', 'E'];
                    const newTab = abcToTablature(abcText, tuning);
                    setRenderTablature(newTab);
                    setAbcError(null);
                  } catch (err) {
                    setAbcError('Erreur lors de la conversion ABC vers tablature.');
                  }
                }}
                className="px-3 py-1.5 text-xs rounded bg-orange-500 hover:bg-orange-600 text-white"
              >
                Prévisualiser ABC
              </button>
              <button
                type="button"
                onClick={() => {
                  if (tablature) {
                    setRenderTablature(tablature);
                    try {
                      const abc = tablatureToABC(tablature);
                      setAbcText(abc);
                    } catch {
                      // ignorer
                    }
                    setAbcError(null);
                  }
                }}
                className="px-3 py-1.5 text-xs rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
          <p>Erreur : {error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader size="md" variant="light" />
        </div>
      )}

      <div
        ref={containerRef}
        className="tablature-container"
        style={{ width, height, overflow: 'auto' }}
      />
    </div>
  );
};

// Hook pour charger une tablature associée à un preset
export const usePresetTablature = (presetId?: string) => {
  const [tablature, setTablature] = useState<Tablature | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!presetId) {
      setTablature(null);
      return;
    }

    const loadTablature = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Charger la tablature depuis l'API ou le stockage local
        // Pour l'instant, retourner null
        setTablature(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tablature');
      } finally {
        setLoading(false);
      }
    };

    loadTablature();
  }, [presetId]);

  return { tablature, loading, error };
};

export default TabViewer;

