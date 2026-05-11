import { motion } from 'framer-motion';

export default function HistoricalPatterns({ patterns }) {
  if (!patterns || patterns.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <motion.span
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, delay: 0.7, ease: 'backOut' }}
          style={{
            display: 'block',
            width: 3,
            height: 14,
            borderRadius: 99,
            background: 'linear-gradient(180deg, #A78BFA 0%, #7C3AED 100%)',
            transformOrigin: 'top',
            flexShrink: 0,
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
          Historical Patterns
        </h2>
      </div>

      {/* Card with gradient border */}
      <div style={{
        padding: 1,
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(255,255,255,0.03) 50%, rgba(124,58,237,0.1) 100%)',
      }}>
        <div style={{
          background: 'rgba(11,11,17,0.85)',
          borderRadius: 15,
          padding: '24px 24px 20px',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(12px)',
        }}>

          {/* Top shimmer line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '8%',
            right: '8%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent)',
            pointerEvents: 'none',
          }} />

          {/* Ambient glow — top left */}
          <div style={{
            position: 'absolute',
            top: -40,
            left: -20,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative' }}>
            {/* Timeline track */}
            <div style={{
              position: 'absolute',
              left: 5,
              top: 10,
              bottom: 10,
              width: 1,
              background: 'linear-gradient(180deg, rgba(124,58,237,0.5) 0%, rgba(124,58,237,0.08) 100%)',
              borderRadius: 2,
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {patterns.map((pattern, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.65 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'relative',
                    paddingLeft: 26,
                    paddingTop: i === 0 ? 2 : 18,
                    paddingBottom: i === patterns.length - 1 ? 2 : 0,
                  }}
                >
                  {/* Node: outer ring + inner dot */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: i === 0 ? 6 : 24,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(11,11,17,1)',
                    border: '1.5px solid rgba(124,58,237,0.6)',
                    boxShadow: '0 0 10px rgba(124,58,237,0.3), inset 0 0 4px rgba(124,58,237,0.1)',
                  }}>
                    <div style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: 'rgba(167,139,250,0.9)',
                      boxShadow: '0 0 6px rgba(167,139,250,0.8)',
                    }} />
                  </div>

                  {/* Index label */}
                  <span style={{
                    display: 'block',
                    fontSize: 9.5,
                    fontFamily: '"DM Mono", "Fira Mono", monospace',
                    letterSpacing: '0.1em',
                    color: 'rgba(124,58,237,0.6)',
                    fontWeight: 600,
                    marginBottom: 4,
                    textTransform: 'uppercase',
                  }}>
                    Pattern {String(i + 1).padStart(2, '0')}
                  </span>

                  <p style={{
                    fontSize: 13.5,
                    lineHeight: 1.75,
                    color: '#94A3B8',
                    margin: 0,
                    fontFamily: '"DM Sans", "Helvetica Neue", sans-serif',
                    fontWeight: 400,
                    letterSpacing: '0.01em',
                  }}>
                    {typeof pattern === 'string'
                      ? pattern
                      : pattern.text || pattern.description || JSON.stringify(pattern)}
                  </p>

                  {/* Subtle separator — skip last */}
                  {i < patterns.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 26,
                      right: 0,
                      height: 1,
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.04), transparent)',
                    }} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}