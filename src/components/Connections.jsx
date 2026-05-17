import { motion } from 'framer-motion';
import { useEffect, useRef, useState, useMemo } from 'react';

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

/* ── Simple force simulation (no D3 dependency) ── */
function useForceLayout(nodes, edges, width, height) {
  const [positions, setPositions] = useState({});

  useEffect(() => {
    if (!nodes.length || !width || !height) return;

    // Seed positions in a circle
    const pos = {};
    nodes.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      const r = Math.min(width, height) * 0.32;
      pos[n.id] = {
        x: width / 2 + r * Math.cos(angle),
        y: height / 2 + r * Math.sin(angle),
        vx: 0,
        vy: 0,
      };
    });

    const REPULSION = 2800;
    const SPRING_LEN = Math.min(width, height) * 0.28;
    const SPRING_K = 0.06;
    const DAMPING = 0.82;
    const ITERATIONS = 180;

    for (let iter = 0; iter < ITERATIONS; iter++) {
      // Repulsion between all node pairs
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const pa = pos[nodes[a].id];
          const pb = pos[nodes[b].id];
          const dx = pb.x - pa.x;
          const dy = pb.y - pa.y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const force = REPULSION / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          pa.vx -= fx; pa.vy -= fy;
          pb.vx += fx; pb.vy += fy;
        }
      }

      // Spring attraction along edges
      edges.forEach(({ source, target }) => {
        const ps = pos[source];
        const pt = pos[target];
        if (!ps || !pt) return;
        const dx = pt.x - ps.x;
        const dy = pt.y - ps.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = SPRING_K * (dist - SPRING_LEN);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        ps.vx += fx; ps.vy += fy;
        pt.vx -= fx; pt.vy -= fy;
      });

      // Integrate + damp + clamp to bounds
      const PAD = 44;
      nodes.forEach(n => {
        const p = pos[n.id];
        p.vx *= DAMPING; p.vy *= DAMPING;
        p.x = Math.max(PAD, Math.min(width - PAD, p.x + p.vx));
        p.y = Math.max(PAD, Math.min(height - PAD, p.y + p.vy));
      });
    }

    // Strip velocity, keep only x/y
    const final = {};
    nodes.forEach(n => { final[n.id] = { x: pos[n.id].x, y: pos[n.id].y }; });
    setPositions(final);
  }, [nodes.length, edges.length, width, height]); // eslint-disable-line

  return positions;
}

/* ── NODE DEGREE (how many edges touch each node) ── */
function useDegrees(nodes, edges) {
  return useMemo(() => {
    const deg = {};
    nodes.forEach(n => { deg[n.id] = 0; });
    edges.forEach(({ source, target }) => {
      if (deg[source] !== undefined) deg[source]++;
      if (deg[target] !== undefined) deg[target]++;
    });
    return deg;
  }, [nodes, edges]);
}

/* ── GRAPH SVG ── */
function ConnectionGraph({ connections, width, height }) {
  const [hovered, setHovered] = useState(null);

  // Derive unique nodes + edges from connections array
  const { nodes, edges } = useMemo(() => {
    const nodeSet = new Set();
    const edgeList = [];
    connections.forEach((conn, i) => {
      const isObj = typeof conn === 'object' && conn !== null;
      const from = isObj ? (conn.from || '') : String(conn);
      const to = isObj ? (conn.to || '') : '';
      const type = isObj ? (conn.type || '') : '';
      if (from) nodeSet.add(from);
      if (to) nodeSet.add(to);
      if (from && to) edgeList.push({ id: i, source: from, target: to, type });
    });
    return {
      nodes: Array.from(nodeSet).map(id => ({ id })),
      edges: edgeList,
    };
  }, [connections]);

  const positions = useForceLayout(nodes, edges, width, height);
  const degrees = useDegrees(nodes, edges);

  if (!Object.keys(positions).length) return null;

  const hoveredEdges = new Set(
    hovered
      ? edges.filter(e => e.source === hovered || e.target === hovered).map(e => e.id)
      : []
  );

  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
    >
      <defs>
        {/* Arrowhead marker */}
        <marker
          id="arrow"
          markerWidth="7" markerHeight="7"
          refX="6" refY="3.5"
          orient="auto"
        >
          <path d="M0,1 L6,3.5 L0,6 Z" fill="rgba(232,160,48,0.35)" />
        </marker>
        <marker
          id="arrow-hot"
          markerWidth="7" markerHeight="7"
          refX="6" refY="3.5"
          orient="auto"
        >
          <path d="M0,1 L6,3.5 L0,6 Z" fill="rgba(232,160,48,0.9)" />
        </marker>

        {/* Node glow filter */}
        <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── EDGES ── */}
      {edges.map(edge => {
        const ps = positions[edge.source];
        const pt = positions[edge.target];
        if (!ps || !pt) return null;

        const isHot = hoveredEdges.has(edge.id);

        // Shorten line so it doesn't overlap node circle
        const dx = pt.x - ps.x;
        const dy = pt.y - ps.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const nodeR = 16;
        const sx = ps.x + (dx / dist) * nodeR;
        const sy = ps.y + (dy / dist) * nodeR;
        const tx = pt.x - (dx / dist) * (nodeR + 6);
        const ty = pt.y - (dy / dist) * (nodeR + 6);

        return (
          <g key={edge.id}>
            <line
              x1={sx} y1={sy} x2={tx} y2={ty}
              stroke={isHot ? 'rgba(232,160,48,0.75)' : 'rgba(232,160,48,0.15)'}
              strokeWidth={isHot ? 1.5 : 1}
              markerEnd={`url(#${isHot ? 'arrow-hot' : 'arrow'})`}
              style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
            />
            {/* Edge type label at midpoint */}
            {edge.type && isHot && (
              <text
                x={(sx + tx) / 2}
                y={(sy + ty) / 2 - 7}
                textAnchor="middle"
                style={{
                  fontFamily: T.mono, fontSize: 8,
                  fill: T.amberDim, letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {edge.type}
              </text>
            )}
          </g>
        );
      })}

      {/* ── NODES ── */}
      {nodes.map(node => {
        const p = positions[node.id];
        if (!p) return null;

        const deg = degrees[node.id] || 0;
        const isHot = hovered === node.id;
        const isFaded = hovered && !isHot &&
          !edges.some(e => (e.source === hovered && e.target === node.id) ||
            (e.target === hovered && e.source === node.id));

        // Size scales slightly with degree
        const r = 7 + Math.min(deg, 4) * 1.5;

        return (
          <g
            key={node.id}
            transform={`translate(${p.x},${p.y})`}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Outer glow ring — visible on hover */}
            {isHot && (
              <circle
                r={r + 7}
                fill="none"
                stroke="rgba(232,160,48,0.18)"
                strokeWidth={1}
              />
            )}

            {/* Node circle */}
            <circle
              r={r}
              fill={isHot ? 'rgba(232,160,48,0.18)' : 'rgba(255,255,255,0.04)'}
              stroke={isHot ? T.amber : isFaded ? 'rgba(255,255,255,0.04)' : 'rgba(232,160,48,0.45)'}
              strokeWidth={isHot ? 1.5 : 1}
              style={{ transition: 'fill 0.2s, stroke 0.2s' }}
              filter={isHot ? 'url(#node-glow)' : undefined}
            />

            {/* Degree dot — central fill for high-degree nodes */}
            {deg >= 2 && (
              <circle
                r={2.5}
                fill={isHot ? T.amber : 'rgba(232,160,48,0.5)'}
                style={{ transition: 'fill 0.2s' }}
              />
            )}

            {/* Label — below node */}
            <text
              y={r + 14}
              textAnchor="middle"
              style={{
                fontFamily: T.mono,
                fontSize: isHot ? 10 : 9,
                fill: isHot ? T.text : isFaded ? T.textFaint : T.textMid,
                letterSpacing: '0.06em',
                transition: 'fill 0.2s, font-size 0.2s',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {node.id.length > 16 ? node.id.slice(0, 15) + '…' : node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export default function Connections({ connections }) {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!connections || connections.length === 0) return null;

  const nodeCount = useMemo(() => {
    const s = new Set();
    connections.forEach(c => {
      if (typeof c === 'object') { if (c.from) s.add(c.from); if (c.to) s.add(c.to); }
      else s.add(String(c));
    });
    return s.size;
  }, [connections]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ height: '100%' }}
    >
      <div style={{
        background: T.panel,
        border: `1px solid ${T.border}`,
        borderRadius: 6,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Amber shimmer */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(232,160,48,0.14), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '16px 22px 12px',
          flexShrink: 0,
        }}>
          <div style={{ width: 18, height: 1, background: T.amberDim }} />
          <span style={{
            fontFamily: T.mono, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: T.amberDim,
          }}>
            Connection Graph
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
            <span style={{
              fontFamily: T.mono, fontSize: 9, color: T.textFaint, letterSpacing: '0.12em',
            }}>
              {String(nodeCount).padStart(2, '0')} NODES
            </span>
            <span style={{
              fontFamily: T.mono, fontSize: 9, color: T.textFaint, letterSpacing: '0.12em',
            }}>
              {String(connections.length).padStart(2, '0')} EDGES
            </span>
          </div>
        </div>

        {/* Graph canvas */}
        <div
          ref={containerRef}
          style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        >
          {dims.width > 0 && (
            <ConnectionGraph
              connections={connections}
              width={dims.width}
              height={dims.height}
            />
          )}

          {/* Empty state */}
          {connections.length === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textFaint, letterSpacing: '0.14em' }}>
                NO CONNECTIONS DETECTED
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}