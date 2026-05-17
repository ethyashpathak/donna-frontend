import { motion } from 'framer-motion';

const T = {
  amber: '#E8A030',
  amberDim: 'rgba(232,160,48,0.55)',
  panel: '#0E0E14',
  border: 'rgba(255,255,255,0.055)',
  text: '#F0EDE8',
  textMid: 'rgba(240,237,232,0.45)',
  textFaint: 'rgba(240,237,232,0.22)',
  mono: '"Söhne Mono", "Courier Prime", "Courier New", monospace',
  sans: '"Switzer", "Satoshi", "DM Sans", system-ui, sans-serif',
};

export default function HistoricalPatterns({ patterns }) {
  if (!patterns || patterns.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{
        background: T.panel,
        border: `1px solid ${T.border}`,
        borderRadius: 6,
        padding: '24px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(232,160,48,0.14), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
        }}>
          <div style={{ width: 18, height: 1, background: T.amberDim }} />
          <span style={{
            fontFamily: T.mono, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: T.amberDim,
          }}>
            Historical Patterns
          </span>
        </div>

        {patterns.map((raw, i) => {
          const isObj = typeof raw === 'object' && raw !== null;
          const patternText = isObj
            ? (raw.pattern || raw.text || raw.description || JSON.stringify(raw))
            : raw;
          const frequency = isObj ? raw.frequency : null;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '13px 0',
                borderBottom: i < patterns.length - 1 ? `1px solid ${T.border}` : 'none',
              }}
            >
              <span style={{
                fontFamily: T.mono, fontSize: 11, fontWeight: 600,
                color: T.amberDim, letterSpacing: '0.06em',
                lineHeight: '22px', flexShrink: 0, minWidth: 22,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>

              <p style={{
                fontFamily: T.sans, fontSize: 13.5, lineHeight: 1.7,
                color: T.textMid, margin: 0, flex: 1,
              }}>
                {patternText}
              </p>

              {frequency != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginTop: 2 }}>
                  <div style={{ width: 32, height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 1, overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, typeof frequency === 'number' ? frequency : 50)}%`,
                      height: '100%', background: T.amberDim, borderRadius: 1,
                    }} />
                  </div>
                  <span style={{
                    fontFamily: T.mono, fontSize: 9, color: T.textFaint,
                    letterSpacing: '0.08em', fontVariantNumeric: 'tabular-nums',
                  }}>
                    {typeof frequency === 'number' ? `${frequency}×` : frequency}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}