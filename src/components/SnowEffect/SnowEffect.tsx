import { useState, useEffect } from 'react';

interface SnowEffectProps {
  /**
   * Número de flocos de neve. Padrão: 150
   */
  snowflakeCount?: number;
  /**
   * Se o efeito está ativo. Padrão: true
   */
  active?: boolean;
}

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
}

/**
 * Componente de efeito de neve que cobre toda a tela
 * 
 * @param snowflakeCount - Número de flocos de neve (padrão: 150)
 * @param active - Se o efeito está ativo (padrão: true)
 */
export function SnowEffect({ 
  snowflakeCount = 150, 
  active = true 
}: SnowEffectProps) {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    if (!active) {
      setSnowflakes([]);
      return;
    }

    // Gerar flocos de neve aleatórios
    const generateSnowflakes = (): Snowflake[] => {
      return Array.from({ length: snowflakeCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDuration: 3 + Math.random() * 5, // 3-8 segundos
        animationDelay: Math.random() * 5,
        size: 2 + Math.random() * 4, // 2-6px
        opacity: 0.3 + Math.random() * 0.7, // 0.3-1.0
      }));
    };

    setSnowflakes(generateSnowflakes());
  }, [snowflakeCount, active]);

  if (!active) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9998,
        overflow: 'hidden',
      }}
    >
      {snowflakes.map((snowflake) => (
        <div
          key={snowflake.id}
          className="snowflake"
          style={{
            position: 'absolute',
            left: `${snowflake.left}%`,
            top: '-10px',
            width: `${snowflake.size}px`,
            height: `${snowflake.size}px`,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            opacity: snowflake.opacity,
            animation: `fall ${snowflake.animationDuration}s linear ${snowflake.animationDelay}s infinite`,
            boxShadow: `0 0 ${snowflake.size}px ${snowflake.size / 2}px rgba(255, 255, 255, 0.5)`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(50px) rotate(360deg);
            opacity: 0;
          }
        }
        .snowflake {
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}

