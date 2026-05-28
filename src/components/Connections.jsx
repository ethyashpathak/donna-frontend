import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

/* ── DESIGN TOKENS — matches Donna's existing palette ── */
const T = {
  amber: '#E8A030',
  amberDim: 'rgba(232,160,48,0.55)',
  amberGlow: 'rgba(232,160,48,0.12)',
  panel: '#0E0E14',
  panelRaised: '#13131A',
  border: 'rgba(255,255,255,0.055)',
  borderHot: 'rgba(232,160,48,0.20)',
  text: '#F0EDE8',
  textMid: 'rgba(240,237,232,0.50)',
  textFaint: 'rgba(240,237,232,0.25)',
  mono: '"Söhne Mono", "Courier Prime", "Courier New", monospace',
  sans: '"Switzer", "Satoshi", "DM Sans", system-ui, sans-serif',

  // Severity colours
  high: { dot: '#F87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)', text: '#F87171' },
  medium: { dot: '#FBBF24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.22)', text: '#FBBF24' },
  low: { dot: '#34D399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.20)', text: '#34D399' },
};

/* ── Map severity string → numeric axis value (0–1) ── */
function severityToAxis(s = '') {
  switch (s.toUpperCase()) {
    case 'HIGH':   return 0.82 + Math.random() * 0.12;
    case 'MEDIUM': return 0.44 + Math.random() * 0.16;
    case 'LOW':    return 0.10 + Math.random() * 0.16;
    default:       return 0.3  + Math.random() * 0.2;
  }
}

/* ── Derive impact axis from the impact string ── */
function impactToAxis(impact = '') {
  const txt = impact.toLowerCase();
  if (txt.includes('critical') || txt.includes('severe') || txt.includes('major') || txt.includes('significant'))
    return 0.78 + Math.random() * 0.14;
  if (txt.includes('moderate') || txt.includes('medium') || txt.includes('potential'))
    return 0.42 + Math.random() * 0.18;
  return 0.12 + Math.random() * 0.18;
}

/* ── Colour helpers ── */
function colourFor(severity = '') {
  switch (severity.toUpperCase()) {
    case 'HIGH':   return T.high;
    case 'MEDIUM': return T.medium;
    case 'LOW':    return T.low;
    default:       return T.medium;
  }
}

/* ── Tooltip ── */
function Tooltip({ risk, x, y, containerW, containerH }) {
  const col = colourFor(risk.severity);
  const flipX = x > containerW * 0.65;
  const flipY = y > containerH * 0.6;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'absolute',
        left: flipX ? 'auto' : x + 16,
        right: flipX ? `calc(100% - ${x}px + 16px)` : 'auto',
        top: flipY ? 'auto' : y - 8,
        bottom: flipY ? `calc(100% - ${y}px - 8px)` : 'auto',
        zIndex: 50,
        width: 220,
        background: T.panelRaised,
        border: `1px solid ${col.border}`,
        borderRadius: 8,
        padding: '12px 14px',
        pointerEvents: 'none',
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${col.border}`,
      }}
    >
      {/* Severity badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: col.dot, flexShrink: 0 }} />
        <span style={{
          fontFamily: T.mono, fontSize: 9, letterSpacing: '0.14em',
          color: col.text, textTransform: 'uppercase', fontWeight: 600,
        }}>
          {risk.severity}
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: T.sans, fontSize: 12, fontWeight: 600,
        color: T.text, lineHeight: 1.4, marginBottom: 6,
      }}>
        {risk.title}
      </div>

      {/* Impact */}
      {risk.impact && (
        <div style={{
          fontFamily: T.sans, fontSize: 11, color: T.textMid,
          lineHeight: 1.55, marginBottom: 6,
        }}>
          {risk.impact}
        </div>
      )}

      {/* Reason */}
      {risk.reason && (
        <div style={{
          fontFamily: T.mono, fontSize: 10, color: T.textFaint,
          lineHeight: 1.5, borderTop: `1px solid ${T.border}`, paddingTop: 6,
        }}>
          {risk.reason}
        </div>
      )}
    </motion.div>
  );
}

/* ── Quadrant label ── */
function QuadLabel({ label, sub, style }) {
  return (
    <div style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <div style={{
        fontFamily: T.mono, fontSize: 8, letterSpacing: '0.18em',
        color: 'rgba(240,237,232,0.08)', textTransform: 'uppercase', fontWeight: 600,
        lineHeight: 1.6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: T.mono, fontSize: 7, letterSpacing: '0.1em',
        color: 'rgba(240,237,232,0.05)', textTransform: 'uppercase',
      }}>
        {sub}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export default function RiskMatrix({ risks }) {
  const [hovered, setHovered] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  // Compute stable plot positions once per risks array
  const plotted = useMemo(() => {
    if (!Array.isArray(risks)) return [];
    return risks.map((r, i) => ({
      ...r,
      _x: impactToAxis(r.impact || ''),   // X = business impact (left=low, right=high)
      _y: 1 - severityToAxis(r.severity), // Y = severity (top=high, bottom=low) — inverted for CSS
      _col: colourFor(r.severity),
      _id: i,
    }));
  }, [risks]);

  if (!plotted.length) return null;

  const counts = {
    HIGH:   plotted.filter(r => r.severity?.toUpperCase() === 'HIGH').length,
    MEDIUM: plotted.filter(r => r.severity?.toUpperCase() === 'MEDIUM').length,
    LOW:    plotted.filter(r => r.severity?.toUpperCase() === 'LOW').length,
  };

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
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* Top shimmer */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(232,160,48,0.12), transparent)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '16px 22px 14px',
          borderBottom: `1px solid ${T.border}`,
        }}>
          <div style={{ width: 18, height: 1, background: T.amberDim }} />
          <span style={{
            fontFamily: T.mono, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: T.amberDim,
          }}>
            Risk Matrix
          </span>

          {/* Legend */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            {[
              { label: 'HIGH',   col: T.high,   count: counts.HIGH },
              { label: 'MEDIUM', col: T.medium, count: counts.MEDIUM },
              { label: 'LOW',    col: T.low,    count: counts.LOW },
            ].map(({ label, col, count }) => count > 0 && (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: col.dot }} />
                <span style={{
                  fontFamily: T.mono, fontSize: 9, color: col.text,
                  letterSpacing: '0.1em', opacity: 0.8,
                }}>
                  {count} {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Matrix ── */}
        <div style={{ padding: '20px 22px 20px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>

            {/* Y-axis label */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 18, flexShrink: 0,
            }}>
              <span style={{
                fontFamily: T.mono, fontSize: 8, letterSpacing: '0.18em',
                color: T.textFaint, textTransform: 'uppercase',
                writingMode: 'vertical-rl', transform: 'rotate(180deg)',
              }}>
                Severity
              </span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>

              {/* Plot area */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 300,
                  borderRadius: 4,
                  overflow: 'visible',
                  background: `
                    linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
                  `,
                  backgroundSize: '25% 25%',
                  border: `1px solid ${T.border}`,
                }}
              >
                {/* Quadrant fills */}
                {/* Top-right: high severity, high impact → CRITICAL */}
                <div style={{
                  position: 'absolute', top: 0, left: '50%', right: 0, bottom: '50%',
                  background: 'rgba(248,113,113,0.03)', borderBottom: `1px dashed rgba(255,255,255,0.04)`,
                  borderLeft: `1px dashed rgba(255,255,255,0.04)`,
                }} />
                {/* Top-left */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: '50%', bottom: '50%',
                  background: 'rgba(251,191,36,0.025)',
                }} />
                {/* Bottom-right */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', right: 0, bottom: 0,
                  background: 'rgba(251,191,36,0.025)',
                }} />
                {/* Bottom-left: low severity, low impact → MONITOR */}
                <div style={{
                  position: 'absolute', top: '50%', left: 0, right: '50%', bottom: 0,
                  background: 'rgba(52,211,153,0.02)',
                }} />

                {/* Quadrant labels */}
                <QuadLabel label="Critical" sub="Act now" style={{ top: 8, right: 10, textAlign: 'right' }} />
                <QuadLabel label="Escalate" sub="High watch" style={{ top: 8, left: 10 }} />
                <QuadLabel label="Monitor" sub="Low urgency" style={{ bottom: 8, left: 10 }} />
                <QuadLabel label="Track" sub="Low impact" style={{ bottom: 8, right: 10, textAlign: 'right' }} />

                {/* Centre crosshairs */}
                <div style={{
                  position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
                  background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
                  background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
                }} />

                {/* Risk dots */}
                {plotted.map((r, idx) => (
                  <motion.div
                    key={r._id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + idx * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.parentElement.getBoundingClientRect();
                      const dotRect = e.currentTarget.getBoundingClientRect();
                      setHovered(r);
                      setHoverPos({
                        x: dotRect.left - rect.left + 10,
                        y: dotRect.top - rect.top,
                        containerW: rect.width,
                        containerH: rect.height,
                      });
                    }}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      position: 'absolute',
                      left: `calc(${r._x * 100}% - 7px)`,
                      top: `calc(${r._y * 100}% - 7px)`,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: r._col.bg,
                      border: `1.5px solid ${r._col.dot}`,
                      cursor: 'pointer',
                      zIndex: hovered?._id === r._id ? 20 : 10,
                      boxShadow: hovered?._id === r._id
                        ? `0 0 0 3px ${r._col.bg}, 0 0 12px ${r._col.dot}55`
                        : 'none',
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    {/* Inner pulse for HIGH severity */}
                    {r.severity?.toUpperCase() === 'HIGH' && (
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          position: 'absolute', inset: -3,
                          borderRadius: '50%',
                          border: `1px solid ${r._col.dot}`,
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </motion.div>
                ))}

                {/* Tooltip */}
                <AnimatePresence>
                  {hovered && (
                    <Tooltip
                      risk={hovered}
                      x={hoverPos.x}
                      y={hoverPos.y}
                      containerW={hoverPos.containerW}
                      containerH={hoverPos.containerH}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* X-axis label */}
              <div style={{ textAlign: 'center' }}>
                <span style={{
                  fontFamily: T.mono, fontSize: 8, letterSpacing: '0.18em',
                  color: T.textFaint, textTransform: 'uppercase',
                }}>
                  Business Impact
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Risk list below the matrix ── */}
        <div style={{
          borderTop: `1px solid ${T.border}`,
          padding: '14px 22px 18px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {plotted.map((r, i) => {
            const col = r._col;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05, duration: 0.4 }}
                onMouseEnter={() => setHovered(r)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '9px 12px',
                  borderRadius: 5,
                  border: `1px solid ${hovered?._id === r._id ? col.border : 'transparent'}`,
                  background: hovered?._id === r._id ? col.bg : 'transparent',
                  cursor: 'default',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <div style={{
                  marginTop: 4, width: 6, height: 6, borderRadius: '50%',
                  background: col.dot, flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{
                      fontFamily: T.sans, fontSize: 12, fontWeight: 600,
                      color: T.text, lineHeight: 1.3,
                    }}>
                      {r.title}
                    </span>
                    <span style={{
                      fontFamily: T.mono, fontSize: 8, letterSpacing: '0.12em',
                      color: col.text, textTransform: 'uppercase', flexShrink: 0,
                    }}>
                      {r.severity}
                    </span>
                  </div>
                  {r.impact && (
                    <div style={{
                      fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.5,
                    }}>
                      {r.impact}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}