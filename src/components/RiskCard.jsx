import { motion } from 'framer-motion';
import { useState } from 'react';

function getSeverityStyle(severity) {
  const level = (severity || '').toUpperCase();
  if (level === 'CRITICAL' || level === 'HIGH') {
    return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)', icon: '🔴' };
  }
  if (level === 'MEDIUM') {
    return { color: '#F97316', bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.25)', icon: '🟠' };
  }
  return { color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.25)', icon: '🟢' };
}

function RiskItem({ risk, index }) {
  const style = getSeverityStyle(risk.severity);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(19,19,26,0.6)',
        border: `1px solid ${isHovered ? style.border : 'rgba(255,255,255,0.05)'}`,
        borderRadius: 12,
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Left accent line */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        background: style.color,
        opacity: isHovered ? 1 : 0.5,
        transition: 'opacity 0.3s ease',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 600,
          color: '#FFFFFF',
          margin: 0,
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
        }}>
          {risk.title}
        </h3>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          background: style.bg,
          color: style.color,
          padding: '4px 10px',
          borderRadius: 100,
          letterSpacing: '0.05em',
          flexShrink: 0,
        }}>
          {(risk.severity || 'LOW').toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {risk.reason && (
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: 'rgba(148,163,184,0.5)', fontSize: 13, minWidth: 50, fontWeight: 500 }}>Why</span>
            <p style={{ color: '#94A3B8', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{risk.reason}</p>
          </div>
        )}
        
        {risk.impact && (
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: 'rgba(148,163,184,0.5)', fontSize: 13, minWidth: 50, fontWeight: 500 }}>Impact</span>
            <p style={{ color: '#94A3B8', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{risk.impact}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function RiskCard({ risks }) {
  if (!risks || risks.length === 0) return null;

  const criticalCount = risks.filter(r => ['CRITICAL', 'HIGH'].includes((r.severity || '').toUpperCase())).length;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
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
          Risks Detected
        </h2>
        
        <div style={{ display: 'flex', gap: 8 }}>
          {criticalCount > 0 && (
            <span style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444',
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 10px',
              borderRadius: 100,
              letterSpacing: '0.05em',
            }}>
              {criticalCount} CRITICAL
            </span>
          )}
          <span style={{
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.25)',
            color: '#A78BFA',
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 10px',
            borderRadius: 100,
            letterSpacing: '0.05em',
          }}>
            {risks.length} TOTAL
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {risks.map((risk, i) => (
          <RiskItem key={i} risk={risk} index={i} />
        ))}
      </div>
    </motion.section>
  );
}
