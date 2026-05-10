import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AUTH_URL, getGmailMessages } from '../api';

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(124,58,237,0.06)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    {/* Purple glow orb top right */}
    <div
      style={{
        position: 'absolute',
        top: '-200px',
        right: '-200px',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />
    {/* Cyan glow orb bottom left */}
    <div
      style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />
  </div>
);

const StatusDot = ({ state }) => {
  const colors = {
    idle: 'rgba(148,163,184,0.4)',
    connecting: '#A78BFA',
    success: '#22C55E',
    error: '#EF4444',
  };
  return (
    <motion.span
      animate={state === 'connecting' ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1.2 }}
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: colors[state] || colors.idle,
        marginRight: 8,
        flexShrink: 0,
      }}
    />
  );
};

export default function SignupPage() {
  const { setGmailConnected, setError, error } = useApp();
  const [connectState, setConnectState] = useState('idle'); // idle | connecting | success | error

  const handleConnect = () => {
    setConnectState('connecting');
    setError(null);

    const popup = window.open(AUTH_URL, 'connectGmail', 'width=600,height=700');

    const messageListener = async (event) => {
      if (event.data?.status === 'connected') {
        window.removeEventListener('message', messageListener);
        clearInterval(waitForClose);
        setConnectState('success');
        setTimeout(() => {
          setGmailConnected(true);
          setError(null);
        }, 800);
      }
    };
    window.addEventListener('message', messageListener);

    const waitForClose = setInterval(async () => {
      if (popup.closed) {
        clearInterval(waitForClose);
        window.removeEventListener('message', messageListener);

        try {
          await getGmailMessages();
          setConnectState('success');
          setTimeout(() => {
            setGmailConnected(true);
            setError(null);
          }, 800);
        } catch {
          setConnectState('error');
          setError('Connection failed — try again');
        }
      }
    }, 500);
  };

  const buttonLabel = {
    idle: 'Connect Gmail',
    connecting: 'Connecting...',
    success: 'Connected',
    error: 'Try Again',
  }[connectState];

  const buttonBg = {
    idle: '#7C3AED',
    connecting: '#5B21B6',
    success: '#15803D',
    error: '#B91C1C',
  }[connectState];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '100vh',
        background: '#0A0A0F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        fontFamily: "'DM Sans', 'SF Pro Display', system-ui, sans-serif",
      }}
    >
      <GridBackground />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>

        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: 100,
            padding: '4px 14px',
            marginBottom: '2rem',
          }}
        >
          <StatusDot state={connectState} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#A78BFA', letterSpacing: '0.1em' }}>
            {connectState === 'connecting' ? 'ESTABLISHING SECURE CONNECTION' :
              connectState === 'success' ? 'CONNECTED' :
                'EXECUTIVE INTELLIGENCE PLATFORM'}
          </span>
        </motion.div>

        {/* Brand */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            margin: '0 0 0.5rem',
          }}
        >
          DONNA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: 15,
            color: '#94A3B8',
            margin: '0 0 2.5rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 400,
          }}
        >
          Executive Intelligence
        </motion.p>

        {/* Divider with dot */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: '2rem',
            transformOrigin: 'left',
          }}
        >
          <div style={{ height: 1, width: 40, background: 'rgba(124,58,237,0.6)' }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#7C3AED' }} />
          <div style={{ height: 1, flex: 1, background: 'rgba(30,41,59,0.8)' }} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            fontSize: 16,
            color: '#94A3B8',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}
        >
          Connect your Gmail and let Donna surface critical risks, blockers,
          and dependencies across your organizational communication —
          automatically.
        </motion.p>

        {/* Connect button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={handleConnect}
            disabled={connectState === 'connecting' || connectState === 'success'}
            whileHover={connectState === 'idle' || connectState === 'error' ? { scale: 1.02 } : {}}
            whileTap={connectState === 'idle' || connectState === 'error' ? { scale: 0.98 } : {}}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: buttonBg,
              border: 'none',
              borderRadius: 10,
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 600,
              cursor: connectState === 'connecting' || connectState === 'success' ? 'default' : 'pointer',
              transition: 'background 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              letterSpacing: '0.01em',
            }}
          >
            {connectState === 'connecting' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{
                  width: 16,
                  height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                }}
              />
            )}
            {connectState === 'success' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                ✓
              </motion.span>
            )}
            {buttonLabel}
          </motion.button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                color: '#EF4444',
                fontSize: 13,
                textAlign: 'center',
                marginTop: '0.75rem',
              }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Trust text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: 12,
            color: 'rgba(148,163,184,0.5)',
            textAlign: 'center',
            marginTop: '1rem',
          }}
        >
          Read-only access. Your emails never leave your server.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          style={{
            height: 1,
            background: 'rgba(30,41,59,0.8)',
            margin: '2rem 0',
          }}
        />

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}
        >
          {[
            { icon: '🔒', label: 'Read-only access', sub: 'Gmail API scoped' },
            { icon: '🛡', label: 'Secure storage', sub: 'Supabase encrypted' },
            { icon: '⚡', label: 'Gemini AI', sub: 'Google powered' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              style={{
                background: 'rgba(19,19,26,0.8)',
                border: '1px solid rgba(30,41,59,0.8)',
                borderRadius: 10,
                padding: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 2 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)' }}>
                {item.sub}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom corner decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            fontSize: 11,
            color: 'rgba(148,163,184,0.25)',
            letterSpacing: '0.1em',
          }}
        >
          DONNA © 2025
        </motion.div>
      </div>
    </motion.div>
  );
}