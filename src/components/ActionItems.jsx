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

/* ── Custom SVG checkbox (square, not native input) ── */
function CheckboxSVG({ checked, isHigh }) {
  const strokeColor = checked
    ? 'rgba(74,222,128,0.6)'
    : isHigh
      ? T.amber
      : 'rgba(240,237,232,0.18)';
  const fillColor = checked
    ? 'rgba(74,222,128,0.08)'
    : 'transparent';

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect
        x="1" y="1" width="14" height="14" rx="2"
        stroke={strokeColor} strokeWidth="1.5"
        fill={fillColor}
      />
      {checked && (
        <path
          d="M4.5 8.5L7 11L11.5 5.5"
          stroke="rgba(74,222,128,0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default function ActionItems({ items }) {
  if (!items || items.length === 0) return null;

  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  const resolvedCount = Object.values(checked).filter(Boolean).length;
  const progressPct = (resolvedCount / items.length) * 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
          pointerEvents: 'none',
        }} />

        {/* Panel header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 18, height: 1, background: T.amberDim }} />
            <span style={{
              fontFamily: T.mono, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: T.amberDim,
            }}>
              Action Items
            </span>
          </div>

          <span style={{
            fontFamily: T.mono, fontSize: 9, fontWeight: 600,
            letterSpacing: '0.12em', color: T.textFaint,
          }}>
            {String(items.length - resolvedCount).padStart(2, '0')} PENDING
          </span>
        </div>

        {/* Item rows */}
        {items.map((item, i) => {
          const isDone = checked[i];
          // Determine priority — items may be objects { task, priority, owner } or strings
          const isObject = typeof item === 'object' && item !== null;
          const task = isObject ? item.task : item;
          const priority = isObject ? (item.priority || '').toLowerCase() : '';
          const owner = isObject ? item.owner : null;
          const isHigh = priority === 'high' || priority === 'urgent' || priority === 'critical';

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.35 + i * 0.06,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => toggle(i)}
              whileHover={{ y: -1 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '14px 0',
                borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : 'none',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease',
              }}
            >
              {/* Custom SVG checkbox */}
              <div style={{ marginTop: 2 }}>
                <CheckboxSVG checked={isDone} isHigh={isHigh} />
              </div>

              {/* Task text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: T.sans,
                  fontSize: 13.5,
                  lineHeight: 1.65,
                  margin: 0,
                  color: isDone ? T.textFaint : T.text,
                  textDecoration: isDone ? 'line-through' : 'none',
                  textDecorationColor: T.textFaint,
                  transition: 'color 0.3s ease',
                }}>
                  {task}
                </p>

                {/* Owner — mono text */}
                {owner && (
                  <span style={{
                    fontFamily: T.mono,
                    fontSize: 10,
                    color: T.textFaint,
                    letterSpacing: '0.06em',
                    marginTop: 4,
                    display: 'block',
                  }}>
                    → {owner}
                  </span>
                )}
              </div>

              {/* Priority tag */}
              {isHigh && !isDone && (
                <span style={{
                  fontFamily: T.mono,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  padding: '2px 8px',
                  borderRadius: 3,
                  background: 'rgba(232,160,48,0.08)',
                  border: `1px solid ${T.borderHot}`,
                  color: T.amberDim,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  marginTop: 2,
                }}>
                  {priority.toUpperCase()}
                </span>
              )}

              {/* Resolved tag */}
              {isDone && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: T.mono,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    padding: '2px 8px',
                    borderRadius: 3,
                    background: 'rgba(74,222,128,0.06)',
                    border: '1px solid rgba(74,222,128,0.15)',
                    color: 'rgba(74,222,128,0.5)',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  DONE
                </motion.span>
              )}
            </motion.div>
          );
        })}

        {/* Progress bar */}
        <div style={{
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            flex: 1,
            height: 2,
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 1,
            overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                height: '100%',
                borderRadius: 1,
                background: progressPct === 100 ? T.success : T.amber,
              }}
            />
          </div>

          <span style={{
            fontFamily: T.mono,
            fontSize: 10,
            letterSpacing: '0.1em',
            color: resolvedCount === items.length ? 'rgba(74,222,128,0.55)' : T.textFaint,
            flexShrink: 0,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {String(resolvedCount).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </motion.section>
  );
}