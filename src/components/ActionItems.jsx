import { motion } from 'framer-motion';
import { useState } from 'react';

const PRIORITY = [
  {
    label: 'URGENT',
    barColor: '#FF2D2D',
    barGlow: '0 0 8px rgba(255,45,45,0.6)',
    badgeBg: 'rgba(255,45,45,0.08)',
    badgeBorder: 'rgba(255,45,45,0.28)',
    badgeText: '#FF5555',
    dotColor: '#FF2D2D',
    rowGlow: 'rgba(255,45,45,0.03)',
  },
  {
    label: 'HIGH',
    barColor: '#FF8800',
    barGlow: '0 0 8px rgba(255,136,0,0.5)',
    badgeBg: 'rgba(255,136,0,0.08)',
    badgeBorder: 'rgba(255,136,0,0.25)',
    badgeText: '#FFAA44',
    dotColor: '#FF8800',
    rowGlow: 'rgba(255,136,0,0.02)',
  },
];

function getPriority(i) {
  return PRIORITY[i] ?? null;
}

export default function ActionItems({ items }) {
  if (!items || items.length === 0) return null;

  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  const resolvedCount = Object.values(checked).filter(Boolean).length;
  const progressPct = (resolvedCount / items.length) * 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{ fontFamily: "'DM Mono', 'Fira Mono', 'Courier New', monospace" }}
    >

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 2,
            height: 14,
            borderRadius: 2,
            background: 'linear-gradient(180deg, #7C3AED 0%, rgba(124,58,237,0.15) 100%)',
            boxShadow: '0 0 8px rgba(124,58,237,0.55)',
          }} />
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(148,163,184,0.5)',
          }}>
            Action Items
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {/* Live pulse dot */}
          <span style={{ position: 'relative', display: 'inline-flex', width: 6, height: 6 }}>
            <motion.span
              animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: '#7C3AED',
              }}
            />
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#7C3AED',
              boxShadow: '0 0 6px rgba(124,58,237,0.9)',
              display: 'block',
              position: 'relative',
            }} />
          </span>

          <span style={{
            background: 'rgba(124,58,237,0.09)',
            border: '1px solid rgba(124,58,237,0.22)',
            borderRadius: 4,
            padding: '2px 10px',
            fontSize: 10,
            fontWeight: 700,
            color: '#A78BFA',
            letterSpacing: '0.13em',
          }}>
            {items.length - resolvedCount} PENDING
          </span>
        </div>
      </div>

      {/* ── Item List ── */}
      <div style={{
        background: 'linear-gradient(160deg, #0F0F17 0%, #111120 100%)',
        border: '1px solid rgba(30,41,59,0.85)',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 4px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.025)',
      }}>

        {/* Top shimmer line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.25) 35%, rgba(124,58,237,0.5) 55%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {items.map((item, i) => {
          const priority = getPriority(i);
          const isDone = checked[i];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.35 + i * 0.08 }}
              onClick={() => toggle(i)}
              whileHover={{
                background: isDone
                  ? 'rgba(34,197,94,0.05)'
                  : priority
                    ? priority.rowGlow
                    : 'rgba(124,58,237,0.035)',
              }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 13,
                padding: '15px 18px 15px 20px',
                borderBottom: i < items.length - 1 ? '1px solid rgba(30,41,59,0.75)' : 'none',
                cursor: 'pointer',
                background: isDone ? 'rgba(34,197,94,0.025)' : 'transparent',
                transition: 'background 0.2s ease',
                position: 'relative',
              }}
            >
              {/* Left edge priority strip */}
              {priority && !isDone && (
                <div style={{
                  position: 'absolute',
                  left: 0, top: 0, bottom: 0,
                  width: 2,
                  background: priority.barColor,
                  boxShadow: priority.barGlow,
                }} />
              )}
              {isDone && (
                <div style={{
                  position: 'absolute',
                  left: 0, top: 0, bottom: 0,
                  width: 2,
                  background: 'rgba(34,197,94,0.35)',
                  boxShadow: '0 0 6px rgba(34,197,94,0.2)',
                }} />
              )}

              {/* Checkbox */}
              <motion.div
                animate={isDone ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.2 }}
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: 4,
                  border: isDone
                    ? '1.5px solid rgba(34,197,94,0.6)'
                    : '1.5px solid rgba(148,163,184,0.15)',
                  background: isDone ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.018)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 3,
                  transition: 'all 0.2s ease',
                  boxShadow: isDone ? '0 0 9px rgba(34,197,94,0.22)' : 'none',
                }}
              >
                {isDone && (
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25 }}
                    width="9" height="7" viewBox="0 0 10 8" fill="none"
                  >
                    <motion.path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="#22C55E"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.25 }}
                    />
                  </motion.svg>
                )}
              </motion.div>

              {/* Vertical priority bar */}
              <div style={{
                width: 2,
                borderRadius: 99,
                flexShrink: 0,
                alignSelf: 'stretch',
                minHeight: 18,
                marginTop: 2,
                background: isDone
                  ? 'rgba(34,197,94,0.2)'
                  : priority
                    ? priority.barColor
                    : 'rgba(148,163,184,0.08)',
                boxShadow: (!isDone && priority) ? priority.barGlow : 'none',
                opacity: isDone ? 0.35 : 1,
                transition: 'all 0.3s ease',
              }} />

              {/* Text */}
              <p style={{
                color: isDone ? 'rgba(148,163,184,0.28)' : 'rgba(226,232,240,0.9)',
                fontSize: 13.5,
                lineHeight: 1.65,
                margin: 0,
                flex: 1,
                textDecoration: isDone ? 'line-through' : 'none',
                textDecorationColor: 'rgba(148,163,184,0.2)',
                letterSpacing: '0.01em',
                transition: 'all 0.3s ease',
              }}>
                {item}
              </p>

              {/* Priority badge — first two items */}
              {i < 2 && !isDone && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    padding: '3px 8px',
                    borderRadius: 3,
                    background: priority.badgeBg,
                    border: `1px solid ${priority.badgeBorder}`,
                    color: priority.badgeText,
                    marginTop: 3,
                    boxShadow: `0 0 12px ${priority.badgeBg}`,
                  }}
                >
                  {/* Blinking dot for URGENT */}
                  {i === 0 && (
                    <motion.span
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: priority.dotColor,
                        display: 'inline-block',
                        boxShadow: `0 0 4px ${priority.dotColor}`,
                      }}
                    />
                  )}
                  {priority.label}
                </motion.span>
              )}

              {/* Resolved stamp */}
              {isDone && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    flexShrink: 0,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    padding: '3px 8px',
                    borderRadius: 3,
                    background: 'rgba(34,197,94,0.05)',
                    border: '1px solid rgba(34,197,94,0.15)',
                    color: 'rgba(34,197,94,0.45)',
                    marginTop: 3,
                  }}
                >
                  RESOLVED
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Progress Bar ── */}
      <div style={{ marginTop: 13, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          flex: 1,
          height: 2,
          background: 'rgba(30,41,59,0.65)',
          borderRadius: 99,
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              height: '100%',
              borderRadius: 99,
              background: progressPct === 100
                ? '#22C55E'
                : 'linear-gradient(90deg, #6D28D9 0%, #A78BFA 100%)',
              boxShadow: progressPct === 100
                ? '0 0 8px rgba(34,197,94,0.5)'
                : '0 0 8px rgba(124,58,237,0.45)',
            }}
          />
        </div>

        <span style={{
          fontSize: 10,
          letterSpacing: '0.1em',
          color: resolvedCount === items.length
            ? 'rgba(34,197,94,0.55)'
            : 'rgba(148,163,184,0.3)',
          flexShrink: 0,
          transition: 'color 0.4s ease',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {String(resolvedCount).padStart(2, '0')}/{String(items.length).padStart(2, '0')} RESOLVED
        </span>
      </div>

    </motion.section>
  );
}