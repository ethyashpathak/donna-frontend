import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

/* ── DESIGN TOKENS (mirrored from landing) ── */
const T = {
  amber: '#E8A030',
  amberDim: 'rgba(232,160,48,0.55)',
  amberGlow: 'rgba(232,160,48,0.12)',
  ink: '#09090C',
  border: 'rgba(255,255,255,0.06)',
  borderHot: 'rgba(232,160,48,0.22)',
  text: '#F0EDE8',
  textMid: 'rgba(240,237,232,0.45)',
  textFaint: 'rgba(240,237,232,0.22)',
  mono: '"Söhne Mono", "TX-02", "Courier Prime", "Courier New", monospace',
  display: '"Canela", "Cormorant Garamond", "Playfair Display", Georgia, serif',
  sans: '"Switzer", "Satoshi", "DM Sans", system-ui, sans-serif',
};

/* ── REFRESH ICON ── */
const RefreshIcon = ({ spinning }) => (
  spinning ? (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
      style={{
        width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
        border: `1.5px solid rgba(9,9,12,0.25)`,
        borderTopColor: T.ink,
      }}
    />
  ) : (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M12.5 2.5A6.5 6.5 0 1 1 7 .5c1.8 0 3.43.73 4.6 1.9L13.5 4"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13.5 1v3h-3"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
);

/* ── LOGOUT ICON ── */
const LogoutIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9.5 9.5L12 7l-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 7H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function TopBar() {
  const { runAnalysis, isAnalyzing, lastAnalyzed, gmailConnected, logout } = useApp();
  const [hovered, setHovered] = useState(false);
  const [logoutHovered, setLogoutHovered] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(9,9,12,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      {/* Ambient amber bleed — subtle warmth at top edge */}
      <div style={{
        position: 'absolute', top: 0, left: '30%', right: '30%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(232,160,48,0.28), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Scan line texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
      }} />

      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '0 40px', height: 58,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative',
      }}>

        {/* ── LEFT: WORDMARK ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Logo mark — matches landing */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.2 }}
            style={{
              width: 24, height: 24,
              border: `1.5px solid ${T.amber}`,
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ width: 8, height: 8, background: T.amber, borderRadius: 2 }} />
          </motion.div>

          {/* Wordmark */}
          <span style={{
            fontFamily: T.mono,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: T.text,
          }}>
            Donna
          </span>

          {/* Separator */}
          <div style={{ width: 1, height: 18, background: T.border, flexShrink: 0 }} />

          {/* Subtitle — italic serif, links to landing's display voice */}
          <span style={{
            fontFamily: T.display,
            fontStyle: 'italic',
            fontSize: 13,
            color: T.textMid,
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
          }}>
            Executive Intelligence
          </span>
        </div>

        {/* ── RIGHT: STATUS + ACTION ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

          {/* Gmail status */}
          <AnimatePresence mode="wait">
            <motion.div
              key={gmailConnected ? 'connected' : 'disconnected'}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '5px 12px',
                border: gmailConnected
                  ? '1px solid rgba(74,222,128,0.18)'
                  : '1px solid rgba(239,68,68,0.18)',
                borderRadius: 4,
                background: gmailConnected
                  ? 'rgba(34,197,94,0.05)'
                  : 'rgba(239,68,68,0.05)',
              }}
            >
              <motion.div
                animate={gmailConnected
                  ? {}
                  : { scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }
                }
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: gmailConnected ? '#4ADE80' : '#F87171',
                  boxShadow: gmailConnected
                    ? '0 0 7px rgba(74,222,128,0.6)'
                    : '0 0 7px rgba(248,113,113,0.6)',
                }}
              />
              <span style={{
                fontFamily: T.mono, fontSize: 10, letterSpacing: '0.14em',
                textTransform: 'uppercase', fontWeight: 600,
                color: gmailConnected ? 'rgba(74,222,128,0.7)' : 'rgba(248,113,113,0.65)',
              }}>
                {gmailConnected ? 'Gmail · Live' : 'Disconnected'}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Timestamp — only if present */}
          <AnimatePresence>
            {lastAnalyzed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.35 }}
                style={{
                  overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px',
                  border: `1px solid ${T.border}`,
                  borderRadius: 4,
                }}
              >
                {/* Clock icon */}
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="6" cy="6" r="5" stroke={T.textFaint} strokeWidth="1.2" />
                  <path d="M6 3.5V6l1.5 1.5" stroke={T.textFaint} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{
                  fontFamily: T.mono, fontSize: 10, color: T.textFaint,
                  letterSpacing: '0.06em', whiteSpace: 'nowrap',
                }}>
                  {lastAnalyzed.split(',')[1]?.trim() || lastAnalyzed}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── REFRESH BUTTON ── */}
          <motion.button
            whileHover={!isAnalyzing ? { scale: 1.03 } : {}}
            whileTap={!isAnalyzing ? { scale: 0.96 } : {}}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            onClick={() => !isAnalyzing && runAnalysis()}
            disabled={isAnalyzing}
            style={{
              position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 16px',
              background: isAnalyzing ? 'rgba(232,160,48,0.08)' : T.amber,
              border: `1px solid ${isAnalyzing ? 'rgba(232,160,48,0.25)' : T.amber}`,
              borderRadius: 4,
              color: isAnalyzing ? T.amberDim : T.ink,
              fontFamily: T.mono, fontSize: 10.5, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              cursor: isAnalyzing ? 'default' : 'pointer',
              transition: 'background 0.3s, color 0.3s, border-color 0.3s',
            }}
          >
            {/* Hover shimmer */}
            {!isAnalyzing && (
              <motion.div
                initial={{ x: '-110%' }}
                animate={hovered ? { x: '210%' } : { x: '-110%' }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Pulsing ring when analyzing */}
            {isAnalyzing && (
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{
                  position: 'absolute', inset: -1,
                  border: `1px solid ${T.amberDim}`,
                  borderRadius: 4, pointerEvents: 'none',
                }}
              />
            )}

            <RefreshIcon spinning={isAnalyzing} />
            {isAnalyzing ? 'Analyzing…' : 'Run Briefing'}
          </motion.button>

          {/* ── LOGOUT BUTTON ── */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onHoverStart={() => setLogoutHovered(true)}
            onHoverEnd={() => { setLogoutHovered(false); setConfirmLogout(false); }}
            onClick={() => {
              if (confirmLogout) {
                logout();
                setConfirmLogout(false);
              } else {
                setConfirmLogout(true);
              }
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '6px 14px',
              background: 'transparent',
              border: `1px solid ${confirmLogout ? 'rgba(248,113,113,0.35)' : logoutHovered ? T.borderHot : T.border}`,
              borderRadius: 4,
              color: confirmLogout ? '#F87171' : logoutHovered ? T.amberDim : T.textFaint,
              fontFamily: T.mono, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'border-color 0.3s, color 0.3s',
            }}
          >
            <LogoutIcon />
            <AnimatePresence mode="wait">
              {confirmLogout ? (
                <motion.span
                  key="confirm"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.15 }}
                >
                  Confirm?
                </motion.span>
              ) : (
                <motion.span
                  key="logout"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.15 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}