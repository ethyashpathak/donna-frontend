import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function TopBar() {
  const { runAnalysis, isAnalyzing, lastAnalyzed, gmailConnected } = useApp();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(8, 8, 13, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
      }}
    >
      {/* Top shimmer line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '15%',
        right: '15%',
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.35), transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '0 24px',
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
      }}>

        {/* Left: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Logo mark */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {/* Wide ambient glow — sits behind, bleeds outward */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '160%',
              height: '260%',
              background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.22) 0%, rgba(124,58,237,0.06) 45%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }} />

            <h1 style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: '0.28em',
              lineHeight: 1,
              fontFamily: '"DM Mono", "Fira Mono", monospace',
              position: 'relative',
              zIndex: 1,
              /* White at top-left (light source), bleeds into violet bottom-right */
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F3FF 35%, rgba(196,181,253,0.95) 65%, rgba(124,58,237,0.85) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              /*
                Layer 1: wide violet corona
                Layer 2: tight inner violet rim light
                Layer 3: grounded dark drop — anchors the text to the bar
              */
              filter: [
                'drop-shadow(0 0 28px rgba(139,92,246,0.4))',
                'drop-shadow(0 0 8px rgba(196,181,253,0.35))',
                'drop-shadow(0 2px 8px rgba(0,0,0,0.9))',
              ].join(' '),
            }}>
              DONNA
            </h1>
          </div>

          {/* Divider — slightly taller to match the bigger wordmark */}
          <div
            className="hidden sm:block"
            style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }}
          />

          <span className="hidden sm:inline" style={{
            color: 'rgba(255,255,255,1)',
            fontSize: 10.5,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 600,
            fontFamily: '"DM Mono", "Fira Mono", monospace',
            /* Nudge down a hair so optical baseline aligns with DONNA's cap-height center */
            marginTop: 2,
          }}>
            Executive Intelligence
          </span>
        </div>

        {/* Right: Status + Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

          {/* Gmail status pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '5px 12px',
            borderRadius: 99,
            background: gmailConnected
              ? 'rgba(34,197,94,0.06)'
              : 'rgba(239,68,68,0.06)',
            border: gmailConnected
              ? '1px solid rgba(34,197,94,0.15)'
              : '1px solid rgba(239,68,68,0.15)',
            transition: 'all 0.4s ease',
          }}>
            <motion.div
              animate={gmailConnected ? {} : { scale: [1, 1.25, 1], opacity: [1, 0.45, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: gmailConnected ? '#22C55E' : '#EF4444',
                boxShadow: gmailConnected
                  ? '0 0 8px rgba(34,197,94,0.5)'
                  : '0 0 8px rgba(239,68,68,0.5)',
                flexShrink: 0,
              }}
            />
            <span className="hidden sm:inline" style={{
              color: gmailConnected ? 'rgba(74,222,128,0.8)' : 'rgba(248,113,113,0.8)',
              fontSize: 11.5,
              fontWeight: 600,
              fontFamily: '"DM Mono", "Fira Mono", monospace',
              letterSpacing: '0.04em',
              transition: 'color 0.4s ease',
            }}>
              {gmailConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Last analyzed timestamp */}
          {lastAnalyzed && (
            <>
              <div className="hidden sm:block" style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
              }} />
              <span className="hidden sm:inline" style={{
                color: 'rgba(255,255,255,1)',
                fontSize: 11.5,
                fontFamily: '"DM Mono", "Fira Mono", monospace',
                letterSpacing: '0.03em',
              }}>
                {lastAnalyzed.split(',')[1]?.trim() || lastAnalyzed}
              </span>
            </>
          )}

          {/* Refresh button */}
          <div style={{
            padding: 1, borderRadius: 10, background: isAnalyzing
              ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(124,58,237,0.1))'
              : 'linear-gradient(135deg, rgba(167,139,250,0.5), rgba(124,58,237,0.2))',
            transition: 'background 0.3s',
          }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => runAnalysis()}
              disabled={isAnalyzing}
              style={{
                background: isAnalyzing
                  ? 'rgba(60,28,120,0.85)'
                  : 'rgba(90,38,160,0.9)',
                color: '#FFFFFF',
                border: 'none',
                padding: '7px 16px',
                borderRadius: 9,
                fontSize: 12,
                fontWeight: 700,
                cursor: isAnalyzing ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                letterSpacing: '0.06em',
                fontFamily: '"DM Mono", "Fira Mono", monospace',
                textTransform: 'uppercase',
                transition: 'background 0.25s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Inner shimmer on hover — static highlight at top */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: 'rgba(255,255,255,0.18)',
                pointerEvents: 'none',
              }} />

              {isAnalyzing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                  style={{
                    width: 13,
                    height: 13,
                    border: '1.8px solid rgba(255,255,255,0.25)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    flexShrink: 0,
                  }}
                />
              ) : (
                /* Refresh icon SVG */
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M12.5 2.5A6.5 6.5 0 1 1 7 .5c1.8 0 3.43.73 4.6 1.9L13.5 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M13.5 1v3h-3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}

              {isAnalyzing ? 'Analyzing' : 'Refresh'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}