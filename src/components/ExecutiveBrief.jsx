import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExecutiveBrief({ brief }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!brief) return;
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, [brief]);

  if (!brief) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#94A3B8',
          margin: 0,
        }}>
          Executive Brief
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          style={{
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.3)',
            color: '#A78BFA',
            padding: '4px 12px',
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ color: '#22C55E' }}
              >
                ✓ Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                Copy Brief
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div style={{
        background: 'rgba(19,19,26,0.6)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Quote mark decoration */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: 16,
          fontSize: 80,
          fontFamily: 'serif',
          color: 'rgba(124,58,237,0.1)',
          lineHeight: 1,
          pointerEvents: 'none',
        }}>
          "
        </div>
        
        <p style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: '#E2E8F0',
          margin: 0,
          position: 'relative',
          zIndex: 1,
        }}>
          {brief}
        </p>
      </div>
    </motion.section>
  );
}
