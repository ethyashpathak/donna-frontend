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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative' }}
    >
      {/* Header row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Accent pip */}
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, delay: 0.6, ease: 'backOut' }}
            style={{
              display: 'block',
              width: 3,
              height: 14,
              borderRadius: 99,
              background: 'linear-gradient(180deg, #A78BFA 0%, #7C3AED 100%)',
              transformOrigin: 'top',
            }}
          />
          <h2 style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#64748B',
            margin: 0,
            fontFamily: '"DM Mono", "Fira Mono", monospace',
          }}>
            Executive Brief
          </h2>
        </div>

        {/* Copy button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleCopy}
          style={{
            background: copied
              ? 'rgba(34,197,94,0.08)'
              : 'rgba(124,58,237,0.07)',
            border: copied
              ? '1px solid rgba(34,197,94,0.25)'
              : '1px solid rgba(124,58,237,0.22)',
            color: copied ? '#4ADE80' : '#A78BFA',
            padding: '5px 14px',
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            letterSpacing: '0.04em',
            fontFamily: '"DM Mono", "Fira Mono", monospace',
            transition: 'background 0.25s, border-color 0.25s, color 0.25s',
            backdropFilter: 'blur(4px)',
          }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
              >
                {/* Checkmark SVG */}
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6.5L5 9.5L10 3" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
              >
                {/* Copy SVG */}
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="#A78BFA" strokeWidth="1.4" />
                  <path d="M3 8H2.5A1.5 1.5 0 011 6.5v-5A1.5 1.5 0 012.5 0h5A1.5 1.5 0 019 1.5V2" stroke="#A78BFA" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Copy Brief
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Card with gradient border trick */}
      <div style={{
        padding: 1,
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(124,58,237,0.35) 0%, rgba(255,255,255,0.04) 50%, rgba(124,58,237,0.12) 100%)',
        position: 'relative',
      }}>
        <div style={{
          background: 'rgba(12,12,18,0.82)',
          borderRadius: 15,
          padding: '28px 28px 26px',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(12px)',
        }}>

          {/* Subtle noise texture overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 15,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
            backgroundSize: '160px 160px',
            opacity: 0.6,
            pointerEvents: 'none',
          }} />

          {/* Glow orb top-right */}
          <div style={{
            position: 'absolute',
            top: -30,
            right: -20,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Large decorative quote mark */}
          <div style={{
            position: 'absolute',
            top: 6,
            left: 18,
            fontSize: 96,
            lineHeight: 1,
            fontFamily: '"Playfair Display", "Georgia", serif',
            background: 'linear-gradient(180deg, rgba(167,139,250,0.22) 0%, rgba(124,58,237,0.04) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            pointerEvents: 'none',
            userSelect: 'none',
            letterSpacing: '-0.02em',
          }}>
            "
          </div>

          {/* Thin top-edge shimmer line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)',
            borderRadius: 1,
          }} />

          {/* Brief text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            style={{
              fontSize: 15.5,
              lineHeight: 1.8,
              color: '#CBD5E1',
              margin: 0,
              position: 'relative',
              zIndex: 1,
              paddingLeft: 4,
              fontFamily: '"DM Sans", "Helvetica Neue", sans-serif',
              fontWeight: 400,
              letterSpacing: '0.01em',
            }}
          >
            {brief}
          </motion.p>

          {/* Bottom-right corner accent */}
          <div style={{
            position: 'absolute',
            bottom: 14,
            right: 18,
            display: 'flex',
            gap: 4,
            alignItems: 'center',
            pointerEvents: 'none',
          }}>
            {[0.15, 0.3, 0.5].map((op, i) => (
              <div key={i} style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: `rgba(167,139,250,${op})`,
              }} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}