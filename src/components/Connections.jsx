import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

// ── Helpers ─────────────────────────────────────────────────────────────────

function isCriticalConnection(conn) {
  const str = typeof conn === 'string'
    ? conn
    : `${conn?.entity || ''} ${conn?.status || ''} ${conn?.notes || ''}`;
  return str.toLowerCase().includes('priya') || str.toLowerCase().includes('ooo');
}

function getInitials(conn) {
  const name = typeof conn === 'string' ? conn : (conn?.entity || '');
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('');
}

function parseConnection(conn) {
  if (typeof conn === 'string') {
    const parenMatch = conn.match(/^([^(]+)\(([^)]+)\)/);
    if (parenMatch) return { name: parenMatch[1].trim(), role: parenMatch[2].trim() };
    const dashMatch = conn.match(/^([^—–-]+)[—–-](.+)/);
    if (dashMatch) return { name: dashMatch[1].trim(), role: dashMatch[2].trim() };
    return { name: conn, role: null };
  }
  return {
    name: conn?.entity || 'Unknown',
    role: conn?.role || conn?.status || null,
    notes: conn?.notes || null,
    status: conn?.status || null,
  };
}

function PulsingRing({ color }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8, flexShrink: 0 }}>
      <motion.span
        animate={{ scale: [1, 2.1, 1], opacity: [0.65, 0, 0.65] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }}
      />
      <span style={{
        width: 8, height: 8, borderRadius: '50%', background: color,
        boxShadow: `0 0 7px ${color}`, display: 'block', position: 'relative',
      }} />
    </span>
  );
}

// ── Dependency Graph ─────────────────────────────────────────────────────────

function DependencyGraph({ connections }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const nodesRef = useRef([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dims, setDims] = useState({ w: 0, h: 220 });
  const containerRef = useRef(null);

  // Build nodes from connections
  const parsed = connections.map((c, i) => ({
    ...parseConnection(c),
    critical: isCriticalConnection(c),
    initials: getInitials(typeof c === 'string' ? c : (c?.entity || '')),
    id: i,
  }));

  // Place nodes in a force-settled circular layout
  useEffect(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    const h = 220;
    setDims({ w, h });

    const cx = w / 2;
    const cy = h / 2;
    const n = parsed.length;

    // Critical node goes center, others orbit
    const critIdx = parsed.findIndex(p => p.critical);
    const radius = Math.min(w, h) * 0.33;

    nodesRef.current = parsed.map((p, i) => {
      if (i === critIdx) {
        return { ...p, x: cx, y: cy, vx: 0, vy: 0, targetX: cx, targetY: cy };
      }
      const others = parsed.filter((_, j) => j !== critIdx);
      const pos = others.indexOf(p);
      const angle = (pos / others.length) * Math.PI * 2 - Math.PI / 2;
      return {
        ...p,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: 0, vy: 0,
        targetX: cx + Math.cos(angle) * radius,
        targetY: cy + Math.sin(angle) * radius,
      };
    });
  }, [connections, containerRef.current?.offsetWidth]);

  // Canvas draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dims.w === 0) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function draw() {
      t += 0.012;
      ctx.clearRect(0, 0, dims.w, dims.h);

      const nodes = nodesRef.current;
      if (!nodes.length) { animFrameRef.current = requestAnimationFrame(draw); return; }

      const critNode = nodes.find(n => n.critical);

      // Draw edges FROM every node TO the critical node
      nodes.forEach((node) => {
        if (node.critical || !critNode) return;
        const dx = critNode.x - node.x;
        const dy = critNode.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Animated dash offset
        const dashOffset = -(t * 18) % 20;

        // Glow line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(critNode.x, critNode.y);
        ctx.strokeStyle = 'rgba(255,45,45,0.08)';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Dashed animated line
        ctx.beginPath();
        ctx.setLineDash([5, 8]);
        ctx.lineDashOffset = dashOffset;
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(critNode.x, critNode.y);
        ctx.strokeStyle = 'rgba(255,45,45,0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow head near critical node
        const angle = Math.atan2(dy, dx);
        const arrowX = critNode.x - Math.cos(angle) * 22;
        const arrowY = critNode.y - Math.sin(angle) * 22;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - Math.cos(angle - 0.4) * 7,
          arrowY - Math.sin(angle - 0.4) * 7
        );
        ctx.lineTo(
          arrowX - Math.cos(angle + 0.4) * 7,
          arrowY - Math.sin(angle + 0.4) * 7
        );
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,45,45,0.55)';
        ctx.fill();
        ctx.restore();
      });

      // Draw nodes
      nodes.forEach((node) => {
        const r = node.critical ? 22 : 16;
        const isHovered = hoveredNode === node.id;

        // Outer glow
        const grd = ctx.createRadialGradient(node.x, node.y, r * 0.5, node.x, node.y, r * 2.2);
        if (node.critical) {
          grd.addColorStop(0, `rgba(255,45,45,${0.22 + Math.sin(t * 2) * 0.06})`);
          grd.addColorStop(1, 'rgba(255,45,45,0)');
        } else {
          grd.addColorStop(0, isHovered ? 'rgba(124,58,237,0.22)' : 'rgba(124,58,237,0.1)');
          grd.addColorStop(1, 'rgba(124,58,237,0)');
        }
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = node.critical
          ? 'rgba(20,10,10,0.95)'
          : 'rgba(12,12,22,0.95)';
        ctx.fill();

        // Border
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = node.critical
          ? `rgba(255,45,45,${0.7 + Math.sin(t * 2) * 0.2})`
          : isHovered ? 'rgba(124,58,237,0.7)' : 'rgba(124,58,237,0.35)';
        ctx.lineWidth = node.critical ? 1.8 : 1.2;
        ctx.stroke();

        // Initials text
        ctx.fillStyle = node.critical ? '#FF5555' : '#A78BFA';
        ctx.font = `700 ${node.critical ? 11 : 9}px "DM Mono", "Courier New", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.initials || '?', node.x, node.y);

        // Name label below node
        ctx.fillStyle = node.critical
          ? 'rgba(252,165,165,0.85)'
          : 'rgba(148,163,184,0.55)';
        ctx.font = `600 9px "DM Mono", "Courier New", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const label = node.name.split(' ')[0]; // first name only
        ctx.fillText(label, node.x, node.y + r + 5);

        // OOO tag for critical
        if (node.critical) {
          ctx.fillStyle = 'rgba(255,45,45,0.7)';
          ctx.font = `700 8px "DM Mono", "Courier New", monospace`;
          ctx.fillText('OOO', node.x, node.y + r + 16);
        }
      });

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [dims, hoveredNode, connections]);

  // Mouse hover detection
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const nodes = nodesRef.current;
    let found = null;
    nodes.forEach((node) => {
      const r = node.critical ? 22 : 16;
      const dx = mx - node.x;
      const dy = my - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < r + 4) found = node.id;
    });
    setHoveredNode(found);
  }, []);

  const handleMouseLeave = useCallback(() => setHoveredNode(null), []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Graph card */}
      <div style={{
        background: 'linear-gradient(160deg, #0A0A12 0%, #0D0D1A 100%)',
        border: '1px solid rgba(30,41,59,0.85)',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.02)',
      }}>
        {/* Top shimmer */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,45,45,0.15) 30%, rgba(255,45,45,0.35) 55%, transparent 100%)',
        }} />

        {/* Left edge strip — red for dependency map */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
          background: '#FF2D2D',
          boxShadow: '0 0 8px rgba(255,45,45,0.55)',
        }} />

        {/* Graph header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 16px 0 18px',
        }}>
          <span style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'rgba(148,163,184,0.4)',
            fontFamily: "'DM Mono','Fira Mono','Courier New',monospace",
          }}>
            Dependency Map
          </span>
          <span style={{
            fontSize: 9, letterSpacing: '0.1em',
            color: 'rgba(255,85,85,0.6)',
            fontFamily: "'DM Mono','Fira Mono','Courier New',monospace",
          }}>
            LIVE · {connections.length} NODES
          </span>
        </div>

        <canvas
          ref={canvasRef}
          width={dims.w}
          height={dims.h}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ display: 'block', width: '100%', height: dims.h, cursor: hoveredNode !== null ? 'pointer' : 'default' }}
        />

        {/* Legend */}
        <div style={{
          display: 'flex', gap: 16, padding: '0 18px 11px',
          fontFamily: "'DM Mono','Fira Mono','Courier New',monospace",
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 1, background: 'rgba(255,45,45,0.5)', borderTop: '1px dashed rgba(255,45,45,0.5)' }} />
            <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.35)', letterSpacing: '0.1em' }}>BLOCKS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid rgba(255,45,45,0.7)', background: 'rgba(255,45,45,0.1)' }} />
            <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.35)', letterSpacing: '0.1em' }}>CRITICAL</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid rgba(124,58,237,0.5)', background: 'rgba(124,58,237,0.1)' }} />
            <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.35)', letterSpacing: '0.1em' }}>ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function Connections({ connections }) {
  if (!connections || connections.length === 0) return null;

  const [expanded, setExpanded] = useState(null);
  const criticalCount = connections.filter(isCriticalConnection).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      style={{ fontFamily: "'DM Mono', 'Fira Mono', 'Courier New', monospace" }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 2, height: 14, borderRadius: 2,
            background: 'linear-gradient(180deg, #7C3AED 0%, rgba(124,58,237,0.15) 100%)',
            boxShadow: '0 0 8px rgba(124,58,237,0.55)',
          }} />
          <span style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)',
          }}>
            People &amp; Teams Involved
          </span>
        </div>

        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {criticalCount > 0 && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.22)',
              borderRadius: 4, padding: '2px 9px',
              fontSize: 10, fontWeight: 700, color: '#FF5555', letterSpacing: '0.13em',
            }}>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#FF2D2D', boxShadow: '0 0 5px rgba(255,45,45,0.8)',
                  display: 'inline-block',
                }}
              />
              {criticalCount} CRITICAL
            </span>
          )}
          <span style={{
            background: 'rgba(124,58,237,0.09)',
            border: '1px solid rgba(124,58,237,0.22)',
            borderRadius: 4, padding: '2px 10px',
            fontSize: 10, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.13em',
          }}>
            {connections.length} TOTAL
          </span>
        </div>
      </div>

      {/* ── Dependency Graph ── */}
      <div style={{ marginBottom: 10 }}>
        <DependencyGraph connections={connections} />
      </div>

      {/* ── Person Cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {connections.map((raw, i) => {
          const critical = isCriticalConnection(raw);
          const { name, role } = parseConnection(raw);
          const initials = getInitials(name);
          const isOpen = expanded === i;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.45 + i * 0.07 }}
              onClick={() => setExpanded(isOpen ? null : i)}
              whileHover={{
                background: critical ? 'rgba(239,68,68,0.07)' : 'rgba(124,58,237,0.035)',
              }}
              style={{
                background: critical
                  ? 'rgba(239,68,68,0.04)'
                  : 'linear-gradient(160deg, #0F0F17 0%, #111120 100%)',
                border: `1px solid ${critical ? 'rgba(239,68,68,0.2)' : 'rgba(30,41,59,0.85)'}`,
                borderRadius: 10, padding: '13px 16px',
                cursor: 'pointer', transition: 'background 0.2s ease',
                position: 'relative', overflow: 'hidden',
                boxShadow: critical
                  ? '0 4px 24px rgba(239,68,68,0.07), inset 0 1px 0 rgba(255,255,255,0.02)'
                  : '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.02)',
              }}
            >
              {/* Top shimmer */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: critical
                  ? 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.2) 40%, rgba(239,68,68,0.4) 60%, transparent 100%)'
                  : 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.15) 40%, rgba(124,58,237,0.3) 60%, transparent 100%)',
                pointerEvents: 'none',
              }} />

              {/* Left edge strip */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
                background: critical ? '#FF2D2D' : 'linear-gradient(180deg, #7C3AED 0%, rgba(124,58,237,0.2) 100%)',
                boxShadow: critical ? '0 0 8px rgba(255,45,45,0.55)' : '0 0 6px rgba(124,58,237,0.4)',
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 13, paddingLeft: 10 }}>
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: critical ? 'rgba(239,68,68,0.1)' : 'rgba(124,58,237,0.1)',
                  border: `1px solid ${critical ? 'rgba(239,68,68,0.22)' : 'rgba(124,58,237,0.22)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  color: critical ? '#FF5555' : '#A78BFA',
                  flexShrink: 0, letterSpacing: '0.06em',
                }}>
                  {initials || '?'}
                </div>

                {/* Name + role */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 13.5, fontWeight: 600,
                      color: critical ? '#FCA5A5' : 'rgba(226,232,240,0.92)',
                      letterSpacing: '0.01em',
                    }}>
                      {name}
                    </span>

                    {critical && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.07 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.13em',
                          padding: '2px 8px', borderRadius: 3,
                          background: 'rgba(255,45,45,0.08)',
                          border: '1px solid rgba(255,45,45,0.25)',
                          color: '#FF5555',
                          boxShadow: '0 0 10px rgba(255,45,45,0.08)',
                        }}
                      >
                        <motion.span
                          animate={{ opacity: [1, 0.2, 1] }}
                          transition={{ duration: 1.1, repeat: Infinity }}
                          style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: '#FF2D2D', display: 'inline-block',
                            boxShadow: '0 0 4px #FF2D2D',
                          }}
                        />
                        CRITICAL DEPENDENCY
                      </motion.span>
                    )}
                  </div>

                  {role && (
                    <p style={{
                      fontSize: 11, color: 'rgba(148,163,184,0.4)',
                      margin: '3px 0 0', letterSpacing: '0.04em',
                    }}>
                      {role}
                    </p>
                  )}
                </div>

                <PulsingRing color={critical ? '#FF2D2D' : '#22C55E'} />
              </div>

              {/* Expanded Detail */}
              <AnimatePresence>
                {isOpen && critical && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden', paddingLeft: 10 }}
                  >
                    <div style={{
                      marginTop: 13, paddingTop: 13,
                      borderTop: '1px solid rgba(239,68,68,0.12)',
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                    }}>
                      <div style={{
                        width: 2, borderRadius: 99, alignSelf: 'stretch',
                        background: 'rgba(255,45,45,0.5)',
                        boxShadow: '0 0 6px rgba(255,45,45,0.3)', flexShrink: 0,
                      }} />
                      <p style={{
                        fontSize: 12, color: 'rgba(252,165,165,0.75)',
                        lineHeight: 1.65, margin: 0, letterSpacing: '0.01em',
                      }}>
                        {(() => {
                          const parsed = parseConnection(raw);
                          return parsed.notes || 'This person is a critical dependency. Ensure coverage or escalation paths are in place before proceeding.';
                        })()}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}