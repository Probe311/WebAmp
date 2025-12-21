import React, { useEffect, useState } from 'react';

interface CountdownProps {
  onComplete: () => void;
  isVisible: boolean;
}

export const Countdown: React.FC<CountdownProps> = ({ onComplete, isVisible }) => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setCount(null);
      return;
    }

    // Démarrer le compte à rebours à 4
    setCount(4);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
            setCount(null);
          }, 500);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  if (!isVisible || count === null) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative">
        <div 
          className="text-white font-bold transition-all duration-300"
          style={{
            fontSize: '12rem',
            lineHeight: '1',
            textShadow: '0 0 40px rgba(249, 115, 22, 0.8), 0 0 80px rgba(249, 115, 22, 0.6)',
            animation: 'pulse 0.5s ease-in-out',
            color: '#f97316'
          }}
        >
          {count}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.9; }
          }
        `}</style>
      </div>
    </div>
  );
};

