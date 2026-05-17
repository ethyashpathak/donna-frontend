import { motion } from 'framer-motion';
import { useState } from 'react';

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
  success: '#4ADE80',
  error: '#F87171',
  mono: '"Söhne Mono", "Courier Prime", "Courier New", monospace',
  display: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
  sans: '"Switzer", "Satoshi", "DM Sans", system-ui, sans-serif',
};

/* ── severity tag color ── */
function getSeverityColor(severity) {
  const level = (severity || '').toUpperCase();
  if (level === 'CRITICAL') return T.error;
  if (level === 'HIGH') return T.amber;
  if (level === 'MEDIUM') return T.amberDim;
  return T.textFaint;
}

/* ── RISK ROW ── */
function RiskRow({ risk, index }) {
  const color = getSeverityColor(risk.severity);
  const [hovered, setHovered] = useState(false);
  const indexLabel = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.15 + index * 0.06,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -1 }}
      style={{
        padding: '16px 0',
        borderBottom: `1px solid ${T.border}`,
        cursor: 'default',
        transition: 'border-color 0.3s ease',
        borderColor: hovered ? T.borderHot : T.border,
      }}
    >
      {/* Header: index + title + severity tag */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}>
        {/* Index — mono number */}
        <span style={{
          fontFamily: T.mono,
          fontSize: 11,
          fontWeight: 600,
          color: T.amberDim,
          letterSpacing: '0.06em',
          lineHeight: '22px',
          flexShrink: 0,
          minWidth: 22,
        }}>
          {indexLabel}
        </span>

        {/* Title + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 6,
          }}>
            <h3 style={{
              fontFamily: T.sans,
              fontSize: 14,
              fontWeight: 600,
              color: T.text,
              margin: 0,
              lineHeight: 1.5,
            }}>
              {risk.title}
            </h3>

            {/* Severity tag — small mono */}
            <span style={{
              fontFamily: T.mono,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: color,
              padding: '2px 8px',
              border: `1px solid ${color}33`,
              borderRadius: 3,
              background: `${color}0A`,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              {(risk.severity || 'LOW').toUpperCase()}
            </span>
          </div>

          {/* Description — sans body */}
          {risk.description && (
            <p style={{
              fontFamily: T.sans,
              fontSize: 13,
              lineHeight: 1.7,
              color: T.textMid,
              margin: 0,
            }}>
              {risk.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── MAIN COMPONENT ── */
export default function RiskCard({ risks }) {
  if (!risks || risks.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{
          background: T.panel,
          border: `1px solid ${T.border}`,
          borderRadius: 6,
          padding: '28px',
          position: 'relative',
        }}>
          {/* Amber shimmer line */}
          <div style={{
            position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(232,160,48,0.14), transparent)',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 18, height: 1, background: T.amberDim }} />
            <span style={{
              fontFamily: T.mono, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: T.amberDim,
            }}>
              Risk Assessment
            </span>
          </div>

          <p style={{
            fontFamily: T.sans, fontSize: 13, color: T.textFaint,
            textAlign: 'center', padding: '20px 0',
          }}>
            No risks detected — all clear.
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{
        background: T.panel,
        border: `1px solid ${T.border}`,
        borderRadius: 6,
        padding: '24px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Amber shimmer line */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(232,160,48,0.14), transparent)',
        }} />

        {/* Panel header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 18, height: 1, background: T.amberDim }} />
            <span style={{
              fontFamily: T.mono, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: T.amberDim,
            }}>
              Risk Assessment
            </span>
          </div>

          <span style={{
            fontFamily: T.mono, fontSize: 9, fontWeight: 600,
            letterSpacing: '0.12em', color: T.textFaint,
          }}>
            {String(risks.length).padStart(2, '0')} ITEMS
          </span>
        </div>

        {/* Risk rows */}
        {risks.map((risk, i) => (
          <RiskRow key={i} risk={risk} index={i} />
        ))}
      </div>
    </motion.section>
  );
}