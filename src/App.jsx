import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './context/AppContext';
import SignupPage from './components/SignupPage';
import TopBar from './components/TopBar';
import SummaryCard from './components/SummaryCard';
import RiskCard from './components/RiskCard';
import ActionItems from './components/ActionItems';
import Connections from './components/Connections';
import ExecutiveBrief from './components/ExecutiveBrief';
import HistoricalPatterns from './components/HistoricalPatterns';
import LoadingSpinner from './components/LoadingSpinner';

const GridBackground = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: -1,
  }}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid-bg" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(124,58,237,0.03)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-bg)" />
    </svg>
    <div style={{
      position: 'absolute',
      top: '0%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100vw',
      height: 500,
      background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.08) 0%, transparent 70%)',
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
      <GridBackground />

      <main style={{
        paddingTop: 100,
        paddingBottom: 80,
        paddingLeft: 24,
        paddingRight: 24,
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '100px 0',
                gap: 24,
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(239,68,68,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                fontSize: 24,
              }}>
                !
              </div>
              <p style={{ color: '#E2E8F0', fontSize: 16 }}>{error}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => runAnalysis()}
                style={{
                  background: '#7C3AED',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
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
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 40,
              }}
            >
              <SummaryCard
                summary={insight.summary}
                criticality={insight.criticality}
              />

              <RiskCard risks={insight.risks} />

              <ActionItems items={insight.action_items} />

              <Connections connections={insight.connections} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
        background: '#0A0A0F',
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid rgba(124,58,237,0.2)',
            borderTopColor: '#7C3AED',
          }}
        />
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
            fontFamily: "'DM Sans', 'SF Pro Display', system-ui, sans-serif",
            background: '#0A0A0F',
            color: '#FFFFFF',
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
