import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/* ═══════════════════════════════════════════════════════════════
   RISK CARD — Ultra-Polished Edition
   ═══════════════════════════════════════════════════════════════ */

/* ─────────────── SEVERITY CONFIG ─────────────── */
function getSeverityConfig(severity) {
  const level = (severity || '').toUpperCase();

  const configs = {
    CRITICAL: {
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.08)',
      border: 'rgba(239, 68, 68, 0.3)',
      borderHover: 'rgba(239, 68, 68, 0.5)',
      glow: 'rgba(239, 68, 68, 0.15)',
      glowHover: 'rgba(239, 68, 68, 0.25)',
      accent: '#EF4444',
      icon: CriticalIcon,
      label: 'CRITICAL',
    },
    HIGH: {
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.08)',
      border: 'rgba(239, 68, 68, 0.3)',
      borderHover: 'rgba(239, 68, 68, 0.5)',
      glow: 'rgba(239, 68, 68, 0.15)',
      glowHover: 'rgba(239, 68, 68, 0.25)',
      accent: '#EF4444',
      icon: HighIcon,
      label: 'HIGH',
    },
    MEDIUM: {
      color: '#F97316',
      bg: 'rgba(249, 115, 22, 0.08)',
      border: 'rgba(249, 115, 22, 0.3)',
      borderHover: 'rgba(249, 115, 22, 0.5)',
      glow: 'rgba(249, 115, 22, 0.15)',
      glowHover: 'rgba(249, 115, 22, 0.25)',
      accent: '#F97316',
      icon: MediumIcon,
      label: 'MEDIUM',
    },
    LOW: {
      color: '#22C55E',
      bg: 'rgba(34, 197, 94, 0.08)',
      border: 'rgba(34, 197, 94, 0.3)',
      borderHover: 'rgba(34, 197, 94, 0.5)',
      glow: 'rgba(34, 197, 94, 0.15)',
      glowHover: 'rgba(34, 197, 94, 0.25)',
      accent: '#22C55E',
      icon: LowIcon,
      label: 'LOW',
    },
  };

  return configs[level] || configs.LOW;
}

/* ─────────────── SEVERITY ICONS (SVG) ─────────────── */
const CriticalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke="#EF4444" strokeWidth="1.5" />
    <path d="M7 4V7.5M7 9.5V10" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const HighIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1L1 13H13L7 1Z" stroke="#EF4444" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M7 5.5V9M7 10.5V11" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const MediumIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2L12 12H2L7 2Z" stroke="#F97316" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M7 6V8.5M7 9.5V10" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const LowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke="#22C55E" strokeWidth="1.5" />
    <path d="M5 7L7 9L10 5.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─────────────── SECTION HEADER ─────────────── */
const SectionHeader = ({ criticalCount, totalCount }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingBottom: 12,
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Animated pulse dot */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: criticalCount > 0 ? '#EF4444' : '#22C55E',
          boxShadow: criticalCount > 0
            ? '0 0 8px rgba(239,68,68,0.6), 0 0 16px rgba(239,68,68,0.3)'
            : '0 0 8px rgba(34,197,94,0.5), 0 0 16px rgba(34,197,94,0.2)',
        }}
      />
      <h2 style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#94A3B8',
        margin: 0,
        fontFamily: '"DM Mono", monospace',
      }}>
        Risks Detected
      </h2>
    </div>

    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {criticalCount > 0 && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 }}
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.35)',
            color: '#EF4444',
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: 100,
            letterSpacing: '0.08em',
            fontFamily: '"DM Mono", monospace',
            boxShadow: '0 0 12px rgba(239,68,68,0.15)',
          }}
        >
          {criticalCount} CRITICAL
        </motion.span>
      )}
      <span style={{
        background: 'rgba(124,58,237,0.08)',
        border: '1px solid rgba(124,58,237,0.2)',
        color: '#A78BFA',
        fontSize: 10,
        fontWeight: 600,
        padding: '3px 12px',
        borderRadius: 100,
        letterSpacing: '0.08em',
        fontFamily: '"DM Mono", monospace',
      }}>
        {totalCount} TOTAL
      </span>
    </div>
  </motion.div>
);

/* ─────────────── RISK ITEM ─────────────── */
function RiskItem({ risk, index }) {
  const config = getSeverityConfig(risk.severity);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        background: isHovered ? 'rgba(19,19,26,0.8)' : 'rgba(19,19,26,0.5)',
        border: `1px solid ${isHovered ? config.borderHover : 'rgba(255,255,255,0.04)'}`,
        borderRadius: 14,
        padding: '22px 24px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'background 0.3s ease, border-color 0.3s ease',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Left accent bar */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0.4, width: isHovered ? 4 : 3 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          background: config.accent,
          boxShadow: isHovered ? `0 0 12px ${config.glowHover}` : 'none',
          transition: 'box-shadow 0.3s ease',
          borderRadius: '0 2px 2px 0',
        }}
      />

      {/* Background glow on hover */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '60%',
          height: '200%',
          background: `radial-gradient(circle, ${config.glowHover} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top shimmer line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: 1,
        background: isHovered
          ? `linear-gradient(90deg, transparent, ${config.borderHover}, transparent)`
          : 'transparent',
        transition: 'background 0.3s ease',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
          {/* Severity icon */}
          <motion.div
            animate={{ scale: isHovered ? 1.15 : 1, rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: 2,
              flexShrink: 0,
            }}
          >
            <IconComponent />
          </motion.div>

          <h3 style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
          }}>
            {risk.title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{
            fontSize: 9.5,
            fontWeight: 700,
            background: config.bg,
            color: config.color,
            padding: '4px 12px',
            borderRadius: 100,
            letterSpacing: '0.08em',
            fontFamily: '"DM Mono", monospace',
            border: `1px solid ${config.border}`,
            whiteSpace: 'nowrap',
          }}>
            {config.label}
          </span>

          {/* Expand chevron */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: isHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="rgba(148,163,184,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {(isExpanded || !risk.impact) && (
          <motion.div
            initial={isExpanded ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 26 }}>
              {risk.reason && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
                >
                  <span style={{
                    color: 'rgba(148,163,184,0.4)',
                    fontSize: 11,
                    minWidth: 52,
                    fontWeight: 600,
                    fontFamily: '"DM Mono", monospace',
                    letterSpacing: '0.06em',
                    marginTop: 2,
                  }}>
                    WHY
                  </span>
                  <p style={{ color: '#94A3B8', fontSize: 13, margin: 0, lineHeight: 1.7, flex: 1 }}>
                    {risk.reason}
                  </p>
                </motion.div>
              )}

              {risk.impact && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
                >
                  <span style={{
                    color: 'rgba(148,163,184,0.4)',
                    fontSize: 11,
                    minWidth: 52,
                    fontWeight: 600,
                    fontFamily: '"DM Mono", monospace',
                    letterSpacing: '0.06em',
                    marginTop: 2,
                  }}>
                    IMPACT
                  </span>
                  <p style={{ color: '#94A3B8', fontSize: 13, margin: 0, lineHeight: 1.7, flex: 1 }}>
                    {risk.impact}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed preview (when impact exists and not expanded) */}
      {risk.impact && !isExpanded && (
        <div style={{ paddingLeft: 26, marginTop: 2 }}>
          <p style={{
            color: 'rgba(148,163,184,0.35)',
            fontSize: 12,
            margin: 0,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {risk.impact}
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────── EMPTY STATE ─────────────── */
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      borderRadius: 14,
      background: 'rgba(19,19,26,0.4)',
      border: '1px dashed rgba(255,255,255,0.06)',
    }}
  >
    <motion.div
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M14 20L18.5 24.5L27 16" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
    <p style={{
      marginTop: 16,
      fontSize: 14,
      color: 'rgba(148,163,184,0.5)',
      fontWeight: 500,
      textAlign: 'center',
    }}>
      No risks detected — everything looks good
    </p>
  </motion.div>
);

/* ─────────────── MAIN COMPONENT ─────────────── */
export default function RiskCard({ risks }) {
  if (!risks || risks.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionHeader criticalCount={0} totalCount={0} />
        <EmptyState />
      </motion.section>
    );
  }

  const criticalCount = risks.filter(r =>
    ['CRITICAL', 'HIGH'].includes((r.severity || '').toUpperCase())
  ).length;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <SectionHeader criticalCount={criticalCount} totalCount={risks.length} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {risks.map((risk, i) => (
          <RiskItem key={i} risk={risk} index={i} />
        ))}
      </div>
    </motion.section>
  );
}