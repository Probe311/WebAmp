import React from 'react';
import clsx from 'clsx';

type ScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Contrôle l'overflow.
   * - "auto" (par défaut) : scroll vertical + horizontal si nécessaire
   * - "y" : seulement vertical
   * - "x" : seulement horizontal
   */
  overflow?: 'auto' | 'x' | 'y';
};

/**
 * Composant générique pour avoir des scrollbars customs propres,
 * compatibles avec le design neumorphique.
 */
export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  className,
  overflow = 'auto',
}) => {
  const overflowClasses =
    overflow === 'y'
      ? 'overflow-y-auto overflow-x-hidden'
      : overflow === 'x'
      ? 'overflow-x-auto overflow-y-hidden'
      : 'overflow-auto';

  return (
    <div
      className={clsx(
        'custom-scrollbar',
        overflowClasses,
        // padding léger pour que le thumb ne colle pas aux bords
        '[-webkit-overflow-scrolling:touch]',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ScrollArea;


