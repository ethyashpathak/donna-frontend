import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AUTH_URL, getGmailMessages } from '../api';

/* ═══════════════════════════════════════════════════════════════
   DONNA SIGNUP PAGE — Ultra-Polished Edition
   ═══════════════════════════════════════════════════════════════ */

/* ─────────────── ANIMATED BACKGROUND ─────────────── */
const ParticleField = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.5,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 10,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: `${p.y}vh` }}
          animate={{
            opacity: [0, p.opacity, 0],
            y: [`${p.y}vh`, `${p.y - 30}vh`],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'rgba(167,139,250,0.6)',
            boxShadow: `0 0 ${p.size * 4}px rgba(167,139,250,0.3)`,
          }}
        />
      ))}
    </div>
  );
};

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid-sm" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(124,58,237,0.04)" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid-lg" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgba(124,58,237,0.08)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-sm)" />
      <rect width="100%" height="100%" fill="url(#grid-lg)" />
    </svg>

    {/* Top-right violet bloom */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: '-180px',
        right: '-180px',
        width: '640px',
        height: '640px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 68%)',
      }}
    />

    {/* Secondary bloom */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5, delay: 0.3 }}
      style={{
        position: 'absolute',
        top: '-100px',
        right: '20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
      }}
    />

    {/* Bottom-left cool accent */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, delay: 0.2 }}
      style={{
        position: 'absolute',
        bottom: '-120px',
        left: '-120px',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
      }}
    />

    {/* Bottom-right subtle accent */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.5 }}
      style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)',
      }}
    />

    {/* Center vertical beam */}
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: '40%' }}
      transition={{ duration: 1.5, delay: 0.8 }}
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1px',
        background: 'linear-gradient(180deg, rgba(167,139,250,0.25) 0%, transparent 100%)',
      }}
    />

    {/* Horizontal accent line */}
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: '30%' }}
      transition={{ duration: 1.5, delay: 1 }}
      style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translateX(-50%)',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.12), transparent)',
      }}
    />
  </div>
);

/* ─────────────── STATUS DOT ─────────────── */
const StatusDot = ({ state }) => {
  const colors = {
    idle: 'rgba(148,163,184,0.35)',
    connecting: '#A78BFA',
    success: '#22C55E',
    error: '#EF4444',
  };
  return (
    <motion.span
      animate={state === 'connecting' ? { scale: [1, 1.6, 1], opacity: [1, 0.3, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
      style={{
        display: 'inline-block',
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: colors[state] || colors.idle,
        boxShadow: state === 'connecting'
          ? '0 0 10px rgba(167,139,250,0.8), 0 0 20px rgba(167,139,250,0.3)'
          : state === 'success'
            ? '0 0 10px rgba(34,197,94,0.7), 0 0 20px rgba(34,197,94,0.3)'
            : state === 'error'
              ? '0 0 10px rgba(239,68,68,0.7), 0 0 20px rgba(239,68,68,0.3)'
              : 'none',
        flexShrink: 0,
      }}
    />
  );
};

/* ─────────────── INLINE SVG ICONS ─────────────── */
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="rgba(167,139,250,0.7)" strokeWidth="1.2" />
    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="rgba(167,139,250,0.7)" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="8" cy="11" r="1" fill="rgba(167,139,250,0.7)" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5L13 3.5v4c0 3-2.2 5.5-5 6.5C5.2 13 3 10.5 3 7.5v-4L8 1.5z" stroke="rgba(167,139,250,0.7)" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M6 8l1.5 1.5L10.5 6" stroke="rgba(167,139,250,0.7)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BoltIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <path d="M9.5 1.5L4 9h5.5L6.5 14.5 13 7H7.5L9.5 1.5z" stroke="rgba(167,139,250,0.7)" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const GmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 6.5V17.5C22 18.88 20.88 20 19.5 20H18V9.5L12 13L6 9.5V20H4.5C3.12 20 2 18.88 2 17.5V6.5C2 5.12 3.12 4 4.5 4H5L12 8.5L19 4H19.5C20.88 4 22 5.12 22 6.5Z"
      fill="rgba(255,255,255,0.9)" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7.5L5.5 11L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const trustItems = [
  { Icon: LockIcon, label: 'Read-only access', sub: 'Gmail API scoped' },
  { Icon: ShieldIcon, label: 'Secure storage', sub: 'Supabase encrypted' },
  { Icon: BoltIcon, label: 'Gemini AI', sub: 'Google powered' },
];

/* ─────────────── GLITCH TEXT EFFECT ─────────────── */
const GlitchWordmark = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', display: 'inline-block', marginBottom: '0.6rem', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow behind wordmark */}
      <motion.div
        animate={hovered ? { opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] } : { opacity: 0.2 }}
        transition={{ duration: 2, repeat: hovered ? Infinity : 0 }}
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '140%', height: '300%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <motion.h1
        animate={hovered ? {
          textShadow: [
            '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(139,92,246,0.3)',
            '0 0 50px rgba(167,139,250,0.6), 0 0 100px rgba(167,139,250,0.4)',
            '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(139,92,246,0.3)',
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          fontSize: 92,
          fontWeight: 900,
          letterSpacing: '0.18em',
          lineHeight: 1,
          margin: 0,
          fontFamily: '"DM Mono", "Fira Mono", monospace',
          position: 'relative',
          background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F3FF 30%, rgba(196,181,253,0.95) 60%, rgba(124,58,237,0.9) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: [
            'drop-shadow(0 0 50px rgba(139,92,246,0.5))',
            'drop-shadow(0 0 16px rgba(196,181,253,0.4))',
            'drop-shadow(0 4px 16px rgba(0,0,0,0.9))',
          ].join(' '),
        }}
      >
        DONNA
      </motion.h1>
    </motion.div>
  );
};

/* ─────────────── MAIN COMPONENT ─────────────── */
export default function SignupPage() {
  const { setGmailConnected, setError, error } = useApp();
  const [connectState, setConnectState] = useState('idle');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleConnect = () => {
    setConnectState('connecting');
    setError(null);

    const popup = window.open(AUTH_URL, 'connectGmail', 'width=600,height=700');

    const messageListener = async (event) => {
      if (event.data?.status === 'connected') {
        window.removeEventListener('message', messageListener);
        clearInterval(waitForClose);
        setConnectState('success');
        setTimeout(() => { setGmailConnected(true); setError(null); }, 800);
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
          setTimeout(() => { setGmailConnected(true); setError(null); }, 800);
        } catch {
          setConnectState('error');
          setError('Connection failed — try again');
        }
      }
    }, 500);
  };

  const buttonLabel = {
    idle: 'Connect Gmail',
    connecting: 'Connecting',
    success: 'Connected',
    error: 'Try Again',
  }[connectState];

  const isActive = connectState === 'idle' || connectState === 'error';

  const getButtonGradient = () => {
    if (connectState === 'success') return 'linear-gradient(135deg, rgba(34,197,94,0.5), rgba(34,197,94,0.15))';
    if (connectState === 'error') return 'linear-gradient(135deg, rgba(239,68,68,0.5), rgba(239,68,68,0.15))';
    return 'linear-gradient(135deg, rgba(167,139,250,0.6), rgba(124,58,237,0.2), rgba(99,102,241,0.15))';
  };

  const getButtonBg = () => {
    if (connectState === 'success') return 'rgba(20,83,45,0.95)';
    if (connectState === 'error') return 'rgba(127,29,29,0.95)';
    if (connectState === 'connecting') return 'rgba(46,20,100,0.98)';
    return 'rgba(68,28,140,0.95)';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: '100vh',
        background: '#0A0A0F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        fontFamily: "'DM Sans', 'SF Pro Display', system-ui, sans-serif",
        overflow: 'hidden',
      }}
    >
      <ParticleField />
      <GridBackground />

      {/* Mouse-following spotlight */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124,58,237,0.04), transparent 40%)`,
      }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 10 }}>

        {/* ═══════ STATUS PILL ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: 99,
            padding: '6px 16px',
            marginBottom: '2.4rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <StatusDot state={connectState} />
          <span style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: 'rgba(167,139,250,0.85)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: '"DM Mono", "Fira Mono", monospace',
          }}>
            {connectState === 'connecting' ? 'Establishing Secure Connection' :
              connectState === 'success' ? 'Connected' :
                'Executive Intelligence Platform'}
          </span>
        </motion.div>

        {/* ═══════ DONNA WORDMARK ═══════ */}
        <GlitchWordmark />

        {/* ═══════ SUBTITLE ═══════ */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5 }}
          style={{
            fontSize: 11,
            color: 'rgba(148,163,184,0.5)',
            margin: '0 0 2.6rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            fontFamily: '"DM Mono", "Fira Mono", monospace',
            fontWeight: 600,
          }}
        >
          Executive Intelligence
        </motion.p>

        {/* ═══════ DIVIDER ═══════ */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: '2.4rem',
            transformOrigin: 'left',
          }}
        >
          <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, rgba(124,58,237,0.9), rgba(124,58,237,0.3))' }} />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#7C3AED',
              boxShadow: '0 0 12px rgba(124,58,237,0.8), 0 0 24px rgba(124,58,237,0.4)',
            }}
          />
          <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, rgba(124,58,237,0.2), transparent)' }} />
        </motion.div>

        {/* ═══════ DESCRIPTION ═══════ */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            fontSize: 15.5,
            color: '#64748B',
            lineHeight: 1.85,
            marginBottom: '2.8rem',
            letterSpacing: '0.01em',
          }}
        >
          Connect your Gmail, Slack and Drive and let Donna surface critical risks, blockers,
          and dependencies across your organizational communication
          automatically!
        </motion.p>

        {/* ═══════ CONNECT BUTTON ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Gradient border wrapper with glow */}
          <motion.div
            animate={isActive ? {
              boxShadow: [
                '0 0 20px rgba(124,58,237,0.15)',
                '0 0 30px rgba(124,58,237,0.25)',
                '0 0 20px rgba(124,58,237,0.15)',
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              padding: 1.5,
              borderRadius: 14,
              background: getButtonGradient(),
              transition: 'background 0.5s, box-shadow 0.5s',
            }}
          >
            <motion.button
              onClick={handleConnect}
              disabled={!isActive}
              whileHover={isActive ? {
                scale: 1.02,
                boxShadow: '0 0 30px rgba(124,58,237,0.3), 0 0 60px rgba(124,58,237,0.15)',
              } : {}}
              whileTap={isActive ? { scale: 0.97 } : {}}
              style={{
                width: '100%',
                padding: '15px 26px',
                background: getButtonBg(),
                border: 'none',
                borderRadius: 12.5,
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: '"DM Mono", "Fira Mono", monospace',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: isActive ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'background 0.4s, box-shadow 0.4s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer effect */}
              {isActive && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Top inner highlight */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 1,
                background: 'rgba(255,255,255,0.15)',
                pointerEvents: 'none',
              }} />

              {connectState === 'idle' && <GmailIcon />}

              {connectState === 'connecting' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  style={{
                    width: 15, height: 15,
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    flexShrink: 0,
                  }}
                />
              )}

              {connectState === 'success' && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <CheckIcon />
                </motion.div>
              )}

              {connectState === 'error' && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                >
                  <path d="M7 1V8M7 11V13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </motion.svg>
              )}

              {buttonLabel}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ═══════ ERROR MESSAGE ═══════ */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                color: 'rgba(248,113,113,0.85)',
                fontSize: 12,
                textAlign: 'center',
                marginTop: '0.85rem',
                fontFamily: '"DM Mono", monospace',
                letterSpacing: '0.04em',
                overflow: 'hidden',
              }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ═══════ TRUST NOTE ═══════ */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontSize: 11.5,
            color: 'rgba(148,163,184,0.4)',
            textAlign: 'center',
            marginTop: '1.2rem',
            fontFamily: '"DM Mono", monospace',
            letterSpacing: '0.06em',
          }}
        >
          Read-only access · Your emails never leave your server
        </motion.p>

        {/* ═══════ DIVIDER ═══════ */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.2), transparent)',
            margin: '2.2rem 0',
            transformOrigin: 'center',
          }}
        />

        {/* ═══════ TRUST CARDS ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}
        >
          {trustItems.map(({ Icon, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 },
              }}
              style={{
                padding: 1.5,
                borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(255,255,255,0.03) 100%)',
                cursor: 'default',
              }}
            >
              <div style={{
                background: 'rgba(11,11,17,0.92)',
                borderRadius: 12.5,
                padding: '16px 12px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(124,58,237,0.08)',
              }}>
                {/* Top shimmer */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: '15%', right: '15%',
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent)',
                }} />

                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Icon />
                </motion.div>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'rgba(203,213,225,0.75)',
                  marginBottom: 4,
                  fontFamily: '"DM Mono", monospace',
                  letterSpacing: '0.06em',
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: 10,
                  color: 'rgba(148,163,184,0.4)',
                  fontFamily: '"DM Mono", monospace',
                  letterSpacing: '0.04em',
                }}>
                  {sub}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══════ FOOTER ═══════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 4, height: 4, borderRadius: '50%',
              background: 'rgba(124,58,237,0.5)',
              boxShadow: '0 0 8px rgba(124,58,237,0.5)',
            }}
          />
          <span style={{
            fontSize: 10,
            color: 'rgba(148,163,184,0.25)',
            letterSpacing: '0.14em',
            fontFamily: '"DM Mono", monospace',
            textTransform: 'uppercase',
          }}>
            Donna © 2025
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}