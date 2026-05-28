import { motion } from 'framer-motion';

/* ── DESIGN TOKENS ── */
const T = {
  amber: '#E8A030',
  amberDim: 'rgba(232,160,48,0.55)',
  ink: '#09090C',
  panel: '#0E0E14',
  border: 'rgba(255,255,255,0.055)',
  borderHot: 'rgba(232,160,48,0.18)',
  text: '#F0EDE8',
  textMid: 'rgba(240,237,232,0.45)',
  textFaint: 'rgba(240,237,232,0.22)',
  mono: '"Söhne Mono", "Courier Prime", "Courier New", monospace',
  display: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
  sans: '"Switzer", "Satoshi", "DM Sans", system-ui, sans-serif',
};

export default function ExecutiveBrief({ brief }) {
  if (!brief) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{
        background: T.panel,
        border: `1px solid ${T.border}`,
        borderRadius: 6,
        padding: '28px 28px 26px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Amber shimmer line */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(232,160,48,0.14), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Panel header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 20,
        }}>
          <div style={{ width: 18, height: 1, background: T.amberDim }} />
          <span style={{
            fontFamily: T.mono, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: T.amberDim,
          }}>
            Executive Brief
          </span>
        </div>

        {/* Pull-quote style brief — large serif italic, amber left border */}
        <div style={{
          borderLeft: `2px solid ${T.amber}`,
          paddingLeft: 22,
          position: 'relative',
        }}>
          {/* Decorative quotation mark */}
          <div style={{
            position: 'absolute',
            top: -8,
            left: 10,
            fontFamily: T.display,
            fontStyle: 'italic',
            fontSize: 64,
            lineHeight: 1,
            color: 'rgba(232,160,48,0.10)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            "
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            style={{
              fontFamily: T.display,
              fontStyle: 'italic',
              fontSize: 'clamp(15px, 3vw, 19px)',
              lineHeight: 1.75,
              color: T.text,
              margin: 0,
              fontWeight: 400,
              letterSpacing: '0.01em',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {brief}
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}