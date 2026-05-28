import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './context/AppContext';
import SignupPage from './components/SignupPage';
import TopBar from './components/TopBar';
import SummaryCard from './components/SummaryCard';
import RiskCard from './components/RiskCard';
import ActionItems from './components/ActionItems';
import RiskMatrix from './components/Connections';
import ExecutiveBrief from './components/ExecutiveBrief';
import HistoricalPatterns from './components/HistoricalPatterns';
import LoadingSpinner from './components/LoadingSpinner';

/* ── DESIGN TOKENS (shared with all dashboard components) ── */
const T = {
  amber: '#E8A030',
  amberDim: 'rgba(232,160,48,0.55)',
  ink: '#09090C',
  panel: '#0E0E14',
  border: 'rgba(255,255,255,0.055)',
  text: '#F0EDE8',
  textMid: 'rgba(240,237,232,0.45)',
  textFaint: 'rgba(240,237,232,0.22)',
  error: '#F87171',
  mono: '"Söhne Mono", "Courier Prime", "Courier New", monospace',
  display: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
  sans: '"Switzer", "Satoshi", "DM Sans", system-ui, sans-serif',
};

/* ── FIXED BACKGROUND — scan lines + noise ── */
const FixedBackground = () => (
  <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1 }}>
    {/* Scan lines */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
    }} />
    {/* Noise SVG overlay */}
    <div style={{
      position: 'absolute', inset: 0,
      opacity: 0.028,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      mixBlendMode: 'overlay',
    }} />
  </div>
);

function Dashboard() {
  const { insight, isAnalyzing, error, runAnalysis } = useApp();

  useEffect(() => {
    if (!insight && !isAnalyzing) {
      runAnalysis().catch(() => { });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <TopBar />
      <FixedBackground />

      <main style={{
        paddingTop: 'clamp(72px, 12vw, 100px)',
        paddingBottom: 80,
        paddingLeft: 'clamp(12px, 4vw, 24px)',
        paddingRight: 'clamp(12px, 4vw, 24px)',
        maxWidth: 800,
        margin: '0 auto',
        minHeight: '100vh',
      }}>
        <AnimatePresence mode="wait">
          {isAnalyzing && !insight ? (
            <LoadingSpinner key="loading" />
          ) : error && !insight ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '100px 0',
                gap: 24,
              }}
            >
              {/* Error icon — stroked SVG */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke={T.error} strokeWidth="1.5" />
                <path d="M12 8V13M12 16V16.5" stroke={T.error} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p style={{
                fontFamily: T.sans, color: T.textMid, fontSize: 14,
              }}>{error}</p>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => runAnalysis()}
                style={{
                  background: T.amber,
                  color: T.ink,
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: 4,
                  fontFamily: T.mono,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Retry Analysis
              </motion.button>
            </motion.div>
          ) : insight ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <SummaryCard summary={insight.summary} criticality={insight.criticality} />
              <RiskCard risks={insight.risks} />
              <ActionItems items={insight.action_items} />
              <RiskMatrix risks={insight.risks} />
              <div className="dashboard-bottom-grid">
                <ExecutiveBrief brief={insight.executive_brief} />
                <HistoricalPatterns patterns={insight.historical_patterns} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </>
  );
}

export default function App() {
  const { gmailConnected, connectionChecked, checkConnection } = useApp();

  useEffect(() => {
    checkConnection();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!connectionChecked) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: T.ink,
      }}>
        {/* Square spinner matching boot screen */}
        <div style={{
          width: 32,
          height: 32,
          border: `2px solid ${T.amber}`,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 10, height: 10, background: T.amber, borderRadius: 2 }}
          />
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {gmailConnected ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: T.sans,
            background: T.ink,
            color: T.text,
            minHeight: '100vh',
          }}
        >
          <Dashboard />
        </motion.div>
      ) : (
        <SignupPage key="signup" />
      )}
    </AnimatePresence>
  );
}
