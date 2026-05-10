import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ActionItems({ items }) {
  if (!items || items.length === 0) return null;

  const [checked, setChecked] = useState({});

  const toggle = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-body/60">
          Action Items
        </h2>
        <span
          style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 100,
            padding: '2px 10px',
            fontSize: 11,
            fontWeight: 600,
            color: '#A78BFA',
            letterSpacing: '0.05em',
          }}
        >
          {items.length} PENDING
        </span>
      </div>

      {/* Items */}
      <div
        style={{
          background: '#13131A',
          border: '1px solid #1E293B',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.35 + i * 0.08 }}
            onClick={() => toggle(i)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              padding: '14px 20px',
              borderBottom: i < items.length - 1 ? '1px solid #1E293B' : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              background: checked[i] ? 'rgba(34,197,94,0.04)' : 'transparent',
            }}
            whileHover={{ background: checked[i] ? 'rgba(34,197,94,0.06)' : 'rgba(124,58,237,0.04)' }}
          >
            {/* Checkbox */}
            <motion.div
              animate={checked[i] ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.2 }}
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: checked[i] ? '1.5px solid #22C55E' : '1.5px solid rgba(148,163,184,0.3)',
                background: checked[i] ? 'rgba(34,197,94,0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
                transition: 'all 0.2s ease',
              }}
            >
              {checked[i] && (
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.25 }}
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                >
                  <motion.path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="#22C55E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25 }}
                  />
                </motion.svg>
              )}
            </motion.div>

            {/* Priority indicator */}
            <div
              style={{
                width: 3,
                height: '100%',
                minHeight: 20,
                borderRadius: 99,
                background: i === 0
                  ? '#EF4444'
                  : i === 1
                    ? '#F97316'
                    : 'rgba(148,163,184,0.2)',
                flexShrink: 0,
                marginTop: 2,
                alignSelf: 'stretch',
              }}
            />

            {/* Text */}
            <p
              style={{
                color: checked[i] ? 'rgba(148,163,184,0.4)' : '#FFFFFF',
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
                textDecoration: checked[i] ? 'line-through' : 'none',
                transition: 'all 0.3s ease',
                flex: 1,
              }}
            >
              {item}
            </p>

            {/* Priority badge — first two items only */}
            {i < 2 && !checked[i] && (
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '2px 8px',
                  borderRadius: 99,
                  background: i === 0 ? 'rgba(239,68,68,0.1)' : 'rgba(249,115,22,0.1)',
                  border: `1px solid ${i === 0 ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.3)'}`,
                  color: i === 0 ? '#EF4444' : '#F97316',
                  marginTop: 2,
                }}
              >
                {i === 0 ? 'URGENT' : 'HIGH'}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            flex: 1,
            height: 3,
            background: 'rgba(30,41,59,0.8)',
            borderRadius: 99,
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${(Object.values(checked).filter(Boolean).length / items.length) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: '#22C55E',
              borderRadius: 99,
            }}
          />
        </div>
        <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.5)', flexShrink: 0 }}>
          {Object.values(checked).filter(Boolean).length}/{items.length} resolved
        </span>
      </div>
    </motion.section>
  );
}