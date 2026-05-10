import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function isCriticalConnection(conn) {
  const str = typeof conn === 'string'
    ? conn
    : `${conn?.entity || ''} ${conn?.status || ''} ${conn?.notes || ''}`;
  return str.toLowerCase().includes('priya') || str.toLowerCase().includes('ooo');
}

function getInitials(conn) {
  const name = typeof conn === 'string' ? conn : (conn?.entity || '');
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

function parseConnection(conn) {
  if (typeof conn === 'string') {
    const parenMatch = conn.match(/^([^(]+)\(([^)]+)\)/);
    if (parenMatch) return { name: parenMatch[1].trim(), role: parenMatch[2].trim() };
    const dashMatch = conn.match(/^([^—–-]+)[—–-](.+)/);
    if (dashMatch) return { name: dashMatch[1].trim(), role: dashMatch[2].trim() };
    return { name: conn, role: null };
  }
  // It's an object
  return {
    name: conn?.entity || 'Unknown',
    role: conn?.role || conn?.status || null,
    notes: conn?.notes || null,
    status: conn?.status || null,
  };
}

export default function Connections({ connections }) {
  if (!connections || connections.length === 0) return null;

  const [expanded, setExpanded] = useState(null);
  const criticalCount = connections.filter(isCriticalConnection).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-body/60">
          People &amp; Teams Involved
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {criticalCount > 0 && (
            <span style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 100,
              padding: '2px 10px',
              fontSize: 11,
              fontWeight: 700,
              color: '#EF4444',
              letterSpacing: '0.05em',
            }}>
              {criticalCount} CRITICAL
            </span>
          )}
          <span style={{
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: 100,
            padding: '2px 10px',
            fontSize: 11,
            fontWeight: 600,
            color: '#A78BFA',
            letterSpacing: '0.05em',
          }}>
            {connections.length} TOTAL
          </span>
        </div>
      </div>

      {/* Connection cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
              style={{
                background: critical
                  ? 'rgba(239,68,68,0.05)'
                  : 'rgba(19,19,26,0.9)',
                border: `1px solid ${critical ? 'rgba(239,68,68,0.25)' : '#1E293B'}`,
                borderRadius: 10,
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Critical left border accent */}
              {critical && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  background: '#EF4444',
                  borderRadius: '10px 0 0 10px',
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: critical ? 8 : 0 }}>
                {/* Avatar */}
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: critical
                    ? 'rgba(239,68,68,0.15)'
                    : 'rgba(124,58,237,0.15)',
                  border: `1.5px solid ${critical ? 'rgba(239,68,68,0.3)' : 'rgba(124,58,237,0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: critical ? '#EF4444' : '#A78BFA',
                  flexShrink: 0,
                  letterSpacing: '0.05em',
                }}>
                  {initials || '?'}
                </div>

                {/* Name + role */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: critical ? '#FCA5A5' : '#FFFFFF',
                      letterSpacing: '-0.01em',
                    }}>
                      {name}
                    </span>
                    {critical && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.07 }}
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          padding: '2px 7px',
                          borderRadius: 99,
                          background: 'rgba(239,68,68,0.15)',
                          border: '1px solid rgba(239,68,68,0.35)',
                          color: '#EF4444',
                        }}
                      >
                        ⚠ CRITICAL DEPENDENCY
                      </motion.span>
                    )}
                  </div>
                  {role && (
                    <p style={{
                      fontSize: 12,
                      color: 'rgba(148,163,184,0.6)',
                      margin: '2px 0 0',
                    }}>
                      {role}
                    </p>
                  )}
                </div>

                {/* Status dot */}
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: critical ? '#EF4444' : '#22C55E',
                  flexShrink: 0,
                  boxShadow: critical
                    ? '0 0 6px rgba(239,68,68,0.5)'
                    : '0 0 6px rgba(34,197,94,0.4)',
                }} />
              </div>

              {/* Expanded detail for critical */}
              <AnimatePresence>
                {isOpen && critical && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      overflow: 'hidden',
                      paddingLeft: critical ? 8 : 0,
                    }}
                  >
                    <div style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: '1px solid rgba(239,68,68,0.15)',
                    }}>
                      <p style={{
                        fontSize: 12,
                        color: 'rgba(239,68,68,0.8)',
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                        {(() => {
                          const parsed = parseConnection(raw);
                          return `⚠ ${parsed.notes || 'This person is a critical dependency. Ensure coverage or escalation paths are in place before proceeding.'}`;
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