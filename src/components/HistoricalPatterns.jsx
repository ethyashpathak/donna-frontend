import { motion } from 'framer-motion';

export default function HistoricalPatterns({ patterns }) {
  if (!patterns || patterns.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#94A3B8',
        margin: '0 0 16px 0',
      }}>
        Historical Patterns
      </h2>

      <div style={{
        background: 'rgba(19,19,26,0.6)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: '24px',
      }}>
        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            left: 5,
            top: 8,
            bottom: 8,
            width: 2,
            background: 'rgba(124,58,237,0.2)',
            borderRadius: 2,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {patterns.map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.65 + i * 0.1 }}
                style={{
                  position: 'relative',
                  paddingLeft: 24,
                }}
              >
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 6,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#13131A',
                  border: '2px solid #7C3AED',
                  boxShadow: '0 0 8px rgba(124,58,237,0.4)',
                }} />

                <p style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: '#CBD5E1',
                  margin: 0,
                }}>
                  {typeof pattern === 'string' ? pattern : pattern.text || pattern.description || JSON.stringify(pattern)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
