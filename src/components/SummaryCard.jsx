import { motion } from 'framer-motion';

/* ── DESIGN TOKENS ── */
const T = {
  amber: '#E8A030',
  amberDim: 'rgba(232,160,48,0.55)',
  amberGlow: 'rgba(232,160,48,0.12)',
  ink: '#09090C',
  panel: '#0E0E14',
  border: 'rgba(255,255,255,0.055)',
  borderHot: 'rgba(232,160,48,0.18)',
  text: '#F0EDE8',
  textMid: 'rgba(240,237,232,0.45)',
  textFaint: 'rgba(240,237,232,0.22)',
  success: '#4ADE80',
  error: '#F87171',
  mono: '"Söhne Mono", "Courier Prime", "Courier New", monospace',
  display: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
  sans: '"Switzer", "Satoshi", "DM Sans", system-ui, sans-serif',
};

/* ── criticality badge color ── */
function getBadgeColor(criticality) {
  const level = (criticality || '').toLowerCase();
  if (level === 'critical') return T.error;
  if (level === 'high') return T.amber;
  if (level === 'medium') return T.amberDim;
  return T.textFaint; // low
}

export default function SummaryCard({ summary, criticality }) {
  const badgeColor = getBadgeColor(criticality);
  const label = (criticality || 'low').toUpperCase();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(232,160,48,0.14), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Panel header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Short amber line */}
            <div style={{
              width: 18,
              height: 1,
              background: T.amberDim,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: T.mono,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: T.amberDim,
            }}>
              Executive Summary
            </span>
          </div>

          {/* Criticality badge */}
          {criticality && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              border: `1px solid ${badgeColor}33`,
              borderRadius: 4,
              background: `${badgeColor}0A`,
            }}>
              <div style={{
                width: 5,
                height: 5,
                borderRadius: 2,
                background: badgeColor,
              }} />
              <span style={{
                fontFamily: T.mono,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: badgeColor,
              }}>
                {label}
              </span>
            </div>
          )}
        </div>

        {/* Summary text — serif italic */}
        <p style={{
          fontFamily: T.display,
          fontStyle: 'italic',
          fontSize: 20,
          lineHeight: 1.65,
          color: T.text,
          fontWeight: 400,
          margin: 0,
          letterSpacing: '0.01em',
        }}>
          {summary}
        </p>
      </div>
    </motion.section>
  );
}
