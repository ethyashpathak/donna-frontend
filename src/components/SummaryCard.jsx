import { motion } from 'framer-motion';

function getSeverityColor(criticality) {
  const level = (criticality || '').toUpperCase();
  if (level === 'CRITICAL' || level === 'HIGH') return '#EF4444';
  if (level === 'MEDIUM') return '#F97316';
  return '#22C55E';
}

export default function SummaryCard({ summary, criticality }) {
  const color = getSeverityColor(criticality);
  const label = (criticality || 'LOW').toUpperCase();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div style={{
        background: 'linear-gradient(180deg, rgba(30,41,59,0.4) 0%, rgba(19,19,26,0.8) 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5)',
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: 1,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: 0.5,
        }} />
        <div style={{
          position: 'absolute',
          top: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 300,
          height: 150,
          background: color,
          filter: 'blur(80px)',
          opacity: 0.15,
          pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}>
          <h2 style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#94A3B8',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ color: '#7C3AED' }}>✦</span> Executive Summary
          </h2>
          
          {criticality && (
            <div style={{
              background: `${color}15`,
              border: `1px solid ${color}30`,
              padding: '4px 12px',
              borderRadius: 100,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: color,
                letterSpacing: '0.05em',
              }}>
                {label} RISK
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <p style={{
          fontSize: 20,
          lineHeight: 1.6,
          color: '#FFFFFF',
          fontWeight: 400,
          margin: 0,
          letterSpacing: '-0.01em',
        }}>
          {summary}
        </p>
      </div>
    </motion.section>
  );
}
