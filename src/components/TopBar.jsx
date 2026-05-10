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
        background: 'rgba(10, 10, 15, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '0 24px',
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{
            color: '#FFFFFF',
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: 0,
          }}>
            DONNA
          </h1>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} className="hidden sm:block" />
          <span className="hidden sm:inline" style={{
            color: '#94A3B8',
            fontSize: 12,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>
            Executive Intelligence
          </span>
        </div>

        {/* Right: Status + Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Gmail status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <motion.div
              animate={gmailConnected ? {} : { scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: gmailConnected ? '#22C55E' : '#EF4444',
                boxShadow: gmailConnected ? '0 0 10px rgba(34,197,94,0.4)' : '0 0 10px rgba(239,68,68,0.4)',
              }}
            />
            <span className="hidden sm:inline" style={{
              color: '#94A3B8',
              fontSize: 13,
              fontWeight: 500,
            }}>
              {gmailConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Last analyzed */}
          {lastAnalyzed && (
            <>
              <div className="hidden sm:block" style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
              <span className="hidden sm:inline" style={{
                color: 'rgba(148,163,184,0.5)',
                fontSize: 12,
                fontFamily: 'monospace',
              }}>
                {lastAnalyzed.split(',')[1]?.trim() || lastAnalyzed}
              </span>
            </>
          )}

          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => runAnalysis()}
            disabled={isAnalyzing}
            style={{
              background: isAnalyzing ? 'rgba(124,58,237,0.5)' : '#7C3AED',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: isAnalyzing ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.2s',
            }}
          >
            {isAnalyzing && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                }}
              />
            )}
            {isAnalyzing ? 'Analyzing' : 'Refresh'}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
