import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const T = {
  amber: '#E8A030',
  amberDim: 'rgba(232,160,48,0.55)',
  ink: '#09090C',
  text: '#F0EDE8',
  textMid: 'rgba(240,237,232,0.45)',
  mono: '"Söhne Mono", "Courier Prime", "Courier New", monospace',
};

const MESSAGES = [
  'Scanning threads…',
  'Extracting signals…',
  'Building briefing…',
];

export default function LoadingSpinner() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 0',
        gap: 32,
      }}
    >
      {/* Amber-bordered square logo mark with pulsing inner square */}
      <div style={{ position: 'relative' }}>
        {/* Pulsing glow behind */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -16,
            background: 'radial-gradient(circle, rgba(232,160,48,0.2) 0%, transparent 70%)',
          }}
        />

        {/* Outer square */}
        <div style={{
          width: 48,
          height: 48,
          border: `2px solid ${T.amber}`,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Inner pulsing square */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 16,
              height: 16,
              background: T.amber,
              borderRadius: 3,
            }}
          />
        </div>
      </div>

      {/* Cycling mono text */}
      <div style={{ textAlign: 'center', minHeight: 18 }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={msgIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: T.mono,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.16em',
              color: T.amberDim,
              textTransform: 'uppercase',
            }}
          >
            {MESSAGES[msgIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
