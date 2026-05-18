import { motion } from 'framer-motion';
import { useMemo, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

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

/* ── Custom Node ── */
function ConnectionNode({ data }) {
  const deg = data.degree || 0;
  const size = 28 + Math.min(deg, 4) * 4;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
    }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
      />

      {/* Node circle */}
      <div
        className="connection-node-circle"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'rgba(232,160,48,0.06)',
          border: `1.5px solid rgba(232,160,48,0.45)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
          cursor: 'grab',
        }}>
        {/* Inner dot for high-degree nodes */}
        {deg >= 2 && (
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'rgba(232,160,48,0.5)',
          }} />
        )}
      </div>

      {/* Label */}
      <span style={{
        fontFamily: T.mono,
        fontSize: 9,
        color: T.textMid,
        letterSpacing: '0.06em',
        textAlign: 'center',
        maxWidth: 90,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}>
        {data.label}
      </span>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
      />
    </div>
  );
}

/* nodeTypes must be defined OUTSIDE the component to prevent re-mounts */
const nodeTypes = { connection: ConnectionNode };

/* ── Override React Flow default styles for dark theme ── */
const rfStyle = {
  background: 'transparent',
};

const defaultEdgeOptions = {
  type: 'default',
  animated: true,
  style: { stroke: 'rgba(232,160,48,0.25)', strokeWidth: 1.2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'rgba(232,160,48,0.4)',
    width: 16,
    height: 16,
  },
};

/* ── Build React Flow nodes + edges from connections data ── */
function buildGraph(connections) {

  const nodeSet = new Map();
  const edgeList = [];

  // Object format:
  // [{from,to,type}]
  const objectMode =
    connections.some(
      c =>
        typeof c === "object" &&
        c?.from &&
        c?.to
    );

  if (objectMode) {

    connections.forEach((conn, i) => {

      const from = conn.from;
      const to = conn.to;
      const type = conn.type || "";

      if (!nodeSet.has(from))
        nodeSet.set(
          from,
          { degree: 0 }
        );

      if (!nodeSet.has(to))
        nodeSet.set(
          to,
          { degree: 0 }
        );

      nodeSet.get(from).degree++;
      nodeSet.get(to).degree++;

      edgeList.push({
        id: `e-${i}`,
        source: from,
        target: to,
        label: type
      });

    });

  }

  // String array mode:
  // ["Backend","DevOps","QA"]

  else {

    connections.forEach((name) => {

      if (!nodeSet.has(name)) {

        nodeSet.set(
          name,
          { degree: 0 }
        );

      }

    });

    const ids = Array.from(
      nodeSet.keys()
    );

    // connect sequentially

    for (let i = 0; i < ids.length - 1; i++) {

      nodeSet.get(ids[i]).degree++;
      nodeSet.get(ids[i + 1]).degree++;

      edgeList.push({

        id: `e-${i}`,

        source: ids[i],

        target: ids[i + 1],

        label: "related"

      });

    }

  }

  const nodeIds = Array.from(
    nodeSet.keys()
  );

  const count = nodeIds.length;

  const cx = 300;
  const cy = 160;

  const radius = Math.min(
    240,
    60 + count * 28
  );

  const nodes = nodeIds.map(
    (id, i) => {

      const angle =
        (2 * Math.PI * i) / count
        - Math.PI / 2;

      return {

        id,

        type: "connection",

        position: {
          x:
            cx +
            radius *
            Math.cos(angle) - 20,

          y:
            cy +
            radius *
            Math.sin(angle) - 20
        },

        data: {
          label: id,
          degree:
            nodeSet.get(id)
              .degree
        }

      };

    }
  );

  return {
    nodes,
    edges: edgeList
  };

}

/* ── Inner Flow (needs ReactFlowProvider above it) ── */
function FlowGraph({ connections }) {
  const { nodes: initNodes, edges: initEdges } = useMemo(
    () => buildGraph(connections),
    [connections]
  );

  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, , onEdgesChange] = useEdgesState(initEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      style={rfStyle}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      proOptions={{ hideAttribution: true }}
      minZoom={0.5}
      maxZoom={1.5}
      nodesDraggable
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag
      zoomOnScroll={false}
      zoomOnPinch
      preventScrolling={false}
    />
  );
}

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export default function Connections({ connections }) {
  const nodeCount = useMemo(() => {
    const s = new Set();
    (connections || []).forEach(c => {
      if (typeof c === 'object') { if (c.from) s.add(c.from); if (c.to) s.add(c.to); }
      else s.add(String(c));
    });
    return s.size;
  }, [connections]);

  if (!connections || connections.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{
        background: T.panel,
        border: `1px solid ${T.border}`,
        borderRadius: 6,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Amber shimmer */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(232,160,48,0.14), transparent)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '16px 22px 0',
          position: 'relative', zIndex: 2,
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

        {/* React Flow graph */}
        <div style={{ width: '100%', height: 360 }}>
          <ReactFlowProvider>
            <FlowGraph connections={connections} />
          </ReactFlowProvider>
        </div>
      </div>
    </motion.section>
  );
}