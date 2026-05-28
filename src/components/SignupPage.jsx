import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AUTH_URL,  checkSession ,saveToken} from '../api';


/* ═══════════════════════════════════════════════════════════════
   DONNA — LANDING PAGE
   Aesthetic: Vercel precision × Vite boldness × cinematic depth
   2026 Modern Dark Mode — Layered depth, subtle glows, purposeful motion
═══════════════════════════════════════════════════════════════ */

/* ── DESIGN TOKENS ── */
const T = {
  // Backgrounds — layered dark grays (never pure black)
  bg: '#0A0A0F',
  bgElevated: '#111118',
  bgCard: 'rgba(255,255,255,0.02)',
  bgCardHover: 'rgba(255,255,255,0.04)',

  // Amber accent — warm, muted, premium
  amber: '#E8A030',
  amberDim: 'rgba(232,160,48,0.50)',
  amberGlow: 'rgba(232,160,48,0.10)',
  amberFaint: 'rgba(232,160,48,0.05)',

  // Text — warm off-whites, never pure white
  text: '#F2F0EB',
  textMid: 'rgba(242,240,235,0.55)',
  textFaint: 'rgba(242,240,235,0.30)',
  textMuted: 'rgba(242,240,235,0.18)',

  // Borders — ultra-subtle
  border: 'rgba(255,255,255,0.06)',
  borderHot: 'rgba(232,160,48,0.30)',

  // Gradients
  gradientHero: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(232,160,48,0.08) 0%, transparent 60%)',
  gradientCard: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',

  // Typography
  mono: '"JetBrains Mono", "SF Mono", "Fira Code", "Courier New", monospace',
  display: '"Inter Display", "Inter", "SF Pro Display", system-ui, sans-serif',
  sans: '"Inter", "SF Pro Text", "Switzer", system-ui, sans-serif',
};

/* ── AMBIENT BACKGROUND ── */
const AmbientBg = () => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 0,
    background: T.bg,
    overflow: 'hidden',
  }}>
    {/* Hero glow — top center */}
    <motion.div
      animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
        width: '80vw', height: '60vh',
        background: 'radial-gradient(ellipse, rgba(232,160,48,0.07) 0%, transparent 65%)',
        filter: 'blur(60px)',
      }}
    />

    {/* Cool secondary glow — bottom right */}
    <motion.div
      animate={{ opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '50vw', height: '50vh',
        background: 'radial-gradient(ellipse, rgba(100,120,160,0.06) 0%, transparent 65%)',
        filter: 'blur(80px)',
      }}
    />

    {/* Subtle grid pattern */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
      maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 70%)',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 70%)',
    }} />

    {/* Horizontal rule — subtle */}
    <div style={{
      position: 'absolute', top: '45%', left: 0, right: 0, height: '1px',
      background: 'linear-gradient(90deg, transparent 0%, rgba(232,160,48,0.04) 20%, rgba(232,160,48,0.04) 80%, transparent 100%)',
    }} />
  </div>
);

/* ── NOISE TEXTURE OVERLAY ── */
const NoiseOverlay = () => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
    opacity: 0.025,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '128px 128px',
    mixBlendMode: 'overlay',
  }} />
);

/* ── TICKER TAPE ── */
const tickers = [
  'EXECUTIVE INTELLIGENCE',
  '●',
  'REAL-TIME SIGNAL EXTRACTION',
  '●',
  'GMAIL · SLACK · DRIVE',
  '●',
  'SURFACE RISKS BEFORE THEY ESCALATE',
  '●',
  'POWERED BY GEMINI AI',
  '●',
];

const Ticker = () => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: `1px solid ${T.border}`,
      background: 'rgba(10,10,15,0.80)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      overflow: 'hidden',
      height: 36,
      display: 'flex', alignItems: 'center',
    }}>
      <motion.div
        animate={{ x: [0, '-50%'] }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        style={{
          display: 'flex', gap: '2.5rem', whiteSpace: 'nowrap',
          fontFamily: T.mono, fontSize: 10, letterSpacing: '0.18em',
          color: T.textMuted, textTransform: 'uppercase',
          paddingLeft: '2.5rem',
        }}
      >
        {Array(6).fill(tickers).flat().map((t, i) => (
          <span key={i} style={{
            color: t === '●' ? 'rgba(232,160,48,0.25)' : T.textMuted,
            fontWeight: t === '●' ? 400 : 500,
          }}>
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/* ── NAVIGATION BAR ── */
const Navbar = () => (
  <motion.nav
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.6 }}
    style={{
      position: 'fixed', top: 36, left: 0, right: 0, zIndex: 99,
      borderBottom: `1px solid ${T.border}`,
      background: 'rgba(10,10,15,0.60)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}
  >
    <div className="signup-navbar-inner">
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 26, height: 26,
          border: `1.5px solid ${T.amber}`,
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 9, height: 9,
            background: T.amber, borderRadius: 2.5,
          }} />
        </div>
        <span style={{
          fontFamily: T.mono, fontSize: 12, letterSpacing: '0.2em',
          color: T.text, textTransform: 'uppercase', fontWeight: 600,
        }}>
          Donna
        </span>
        <div style={{
          marginLeft: 4, padding: '2px 7px',
          border: `1px solid rgba(232,160,48,0.18)`,
          borderRadius: 4,
          fontFamily: T.mono, fontSize: 9, letterSpacing: '0.14em',
          color: 'rgba(232,160,48,0.40)', textTransform: 'uppercase',
          fontWeight: 500,
        }}>
          Beta
        </div>
      </div>

      {/* Nav links */}
      <div className="signup-navbar-links">
        {['Features', 'Security', 'Pricing'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} style={{
            fontFamily: T.sans, fontSize: 13, color: T.textFaint,
            textDecoration: 'none',
            transition: 'color 0.2s ease',
            cursor: 'pointer',
          }}
            onMouseEnter={(e) => e.target.style.color = T.textMid}
            onMouseLeave={(e) => e.target.style.color = T.textFaint}
          >
            {item}
          </a>
        ))}
        <div style={{
          width: 1, height: 16, background: T.border, margin: '0 4px',
        }} />
        <span style={{
          fontFamily: T.mono, fontSize: 11, color: T.textMuted,
          letterSpacing: '0.08em',
        }}>
          v2.0
        </span>
      </div>
    </div>
  </motion.nav>
);

/* ── TERMINAL TYPED TEXT ── */
const TypedLine = ({ text, delay = 0, color = T.textMid, style = {}, speed = 28 }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <span style={{ fontFamily: T.mono, color, ...style }}>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ color: T.amber }}
        >▌</motion.span>
      )}
    </span>
  );
};

/* ── STAT CARD — Vercel-style minimal stat ── */
const StatCard = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    style={{
      padding: '24px 0',
    }}
  >
    <div style={{
      fontFamily: T.display,
      fontSize: 'clamp(36px, 4vw, 52px)',
      fontWeight: 600,
      color: T.text,
      lineHeight: 1.1,
      marginBottom: 8,
      letterSpacing: '-0.03em',
    }}>
      {value}
    </div>
    <div style={{
      fontFamily: T.mono,
      fontSize: 10,
      letterSpacing: '0.16em',
      color: T.textFaint,
      textTransform: 'uppercase',
      fontWeight: 500,
    }}>
      {label}
    </div>
  </motion.div>
);

/* ── FEATURE CARD — Modern card with hover lift ── */
const FeatureCard = ({ index, title, desc, delay, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    style={{
      padding: '32px 28px',
      borderRadius: 16,
      border: `1px solid ${T.border}`,
      background: T.gradientCard,
      transition: 'border-color 0.3s ease, background 0.3s ease',
      cursor: 'default',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = T.borderHot;
      e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.background = T.gradientCard;
    }}
  >
    {/* Icon */}
    <div style={{
      width: 40, height: 40,
      borderRadius: 10,
      border: `1px solid ${T.borderHot}`,
      background: 'rgba(232,160,48,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 20,
      fontSize: 18,
    }}>
      {icon}
    </div>

    {/* Index */}
    <div style={{
      fontFamily: T.mono,
      fontSize: 10,
      color: T.amberDim,
      letterSpacing: '0.12em',
      marginBottom: 12,
      fontWeight: 500,
    }}>
      0{index}
    </div>

    {/* Title */}
    <h3 style={{
      fontFamily: T.sans,
      fontSize: 17,
      fontWeight: 600,
      color: T.text,
      marginBottom: 10,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    }}>
      {title}
    </h3>

    {/* Description */}
    <p style={{
      fontFamily: T.sans,
      fontSize: 14,
      color: T.textMid,
      lineHeight: 1.7,
      margin: 0,
    }}>
      {desc}
    </p>
  </motion.div>
);

/* ── SECURITY BADGE ── */
const SecurityBadge = ({ icon, title, desc }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      padding: '14px 0',
      borderBottom: `1px solid ${T.border}`,
    }}
  >
    <div style={{
      marginTop: 2,
      width: 18,
      height: 18,
      flexShrink: 0,
      border: `1px solid rgba(232,160,48,0.25)`,
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <svg width="9" height="9" viewBox="0 0 8 8" fill="none">
        <path d="M1 4.5L3 6.5L7 2" stroke={T.amber} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div>
      <div style={{
        fontFamily: T.sans,
        fontSize: 13,
        fontWeight: 600,
        color: T.text,
        marginBottom: 3
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: T.sans,
        fontSize: 12.5,
        color: T.textFaint,
        lineHeight: 1.6
      }}>
        {desc}
      </div>
    </div>
  </motion.div>
);

/* ── GMAIL SVG ── */
const GmailSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 6.5V17.5C22 18.88 20.88 20 19.5 20H18V9.5L12 13L6 9.5V20H4.5C3.12 20 2 18.88 2 17.5V6.5C2 5.12 3.12 4 4.5 4H5L12 8.5L19 4H19.5C20.88 4 22 5.12 22 6.5Z"
      fill="currentColor" />
  </svg>
);

/* ── CONNECT BUTTON — Vercel-style CTA ── */
const ConnectButton = ({ state, onClick }) => {
  const isActive = state === 'idle' || state === 'error';

  const labels = {
    idle: 'Connect Gmail to begin',
    connecting: 'Establishing connection…',
    success: 'Connected — redirecting',
    error: 'Connection failed — retry',
  };

  const configs = {
    idle: { bg: T.amber, color: T.bg, border: T.amber, shadow: '0 0 24px rgba(232,160,48,0.25)' },
    connecting: { bg: 'transparent', color: T.amberDim, border: T.amberDim, shadow: 'none' },
    success: { bg: 'rgba(34,197,94,0.12)', color: '#4ADE80', border: 'rgba(34,197,94,0.35)', shadow: '0 0 20px rgba(34,197,94,0.15)' },
    error: { bg: 'rgba(239,68,68,0.10)', color: '#F87171', border: 'rgba(239,68,68,0.30)', shadow: '0 0 20px rgba(239,68,68,0.12)' },
  };

  const cfg = configs[state];

  return (
    <motion.button
      onClick={isActive ? onClick : undefined}
      whileHover={isActive ? {
        scale: 1.02,
        boxShadow: '0 0 32px rgba(232,160,48,0.35)',
      } : {}}
      whileTap={isActive ? { scale: 0.98 } : {}}
      style={{
        width: '100%',
        padding: '16px 28px',
        background: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        borderRadius: 10,
        color: cfg.color,
        fontFamily: T.mono,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: isActive ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: cfg.shadow,
      }}
    >
      {/* Shimmer effect on idle */}
      {state === 'idle' && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}

      {state === 'idle' && <GmailSVG />}

      {state === 'connecting' && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: `2px solid ${T.amberDim}`,
            borderTopColor: T.amber,
            flexShrink: 0,
          }}
        />
      )}

      {state === 'success' && (
        <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
          <path d="M2 7.5L5.5 11L12 4" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {state === 'error' && (
        <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
          <path d="M7 1V8M7 10.5V13" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {labels[state]}
    </motion.button>
  );
};

/* ── TERMINAL COMPONENT — Code preview style ── */
const Terminal = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    style={{
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: '24px 28px',
      marginBottom: 56,
      maxWidth: 560,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Terminal header dots */}
    <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,100,100,0.6)' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,200,80,0.6)' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(80,200,120,0.6)' }} />
    </div>

    <div style={{ fontFamily: T.mono, fontSize: 12, lineHeight: 2.2 }}>
      <div style={{ color: T.amberDim, marginBottom: 6 }}>
        <span style={{ color: 'rgba(232,160,48,0.25)' }}>$ </span>
        <TypedLine text="donna --scan --priority=critical" delay={1000} color={T.amberDim} speed={24} />
      </div>
      <div style={{ color: 'rgba(242,240,235,0.35)', fontSize: 11, paddingLeft: 16 }}>
        <TypedLine text="→ 3 blockers detected across 12 threads" delay={2000} color="rgba(242,240,235,0.40)" speed={20} />
      </div>
      <div style={{ color: 'rgba(242,240,235,0.35)', fontSize: 11, paddingLeft: 16 }}>
        <TypedLine text="→ 1 contract renewal flagged — 6 days remaining" delay={3000} color="rgba(242,240,235,0.40)" speed={20} />
      </div>
      <div style={{ color: '#4ADE80', fontSize: 11, paddingLeft: 16 }}>
        <TypedLine text="→ Briefing ready. Connect to begin." delay={4000} color="rgba(74,222,128,0.7)" speed={20} />
      </div>
    </div>

    {/* Subtle glow behind terminal */}
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      height: '80%',
      background: 'radial-gradient(ellipse, rgba(232,160,48,0.04) 0%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: -1,
    }} />
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════════════ */
export default function SignupPage() {
  const { setGmailConnected, setError, error } = useApp();
  const [connectState, setConnectState] = useState('idle');
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -40]);

  const handleConnect = () => {
  setConnectState('connecting');
  setError(null);

  const popup = window.open(AUTH_URL, 'connectGmail', 'width=600,height=700');

  const handleMessage = (event) => {
    if (event.data?.status === 'connected' && event.data?.token) {
      saveToken(event.data.token);   // store JWT in localStorage
      cleanup();
      setConnectState('success');
      setTimeout(() => { setGmailConnected(true); setError(null); }, 900);
    }
  };

  window.addEventListener('message', handleMessage);

  const closeChecker = setInterval(() => {
    try {
      if (!popup || popup.closed) {
        cleanup();
        // Popup closed without postMessage — check if token landed
        if (hasToken()) {
          setConnectState('success');
          setTimeout(() => { setGmailConnected(true); setError(null); }, 900);
        } else {
          setConnectState('error');
          setError('Connection cancelled — please try again');
        }
      }
    } catch (e) { /* cross-origin during Google redirect, ignore */ }
  }, 1000);

  function cleanup() {
    window.removeEventListener('message', handleMessage);
    clearInterval(closeChecker);
    if (popup && !popup.closed) try { popup.close(); } catch (e) {}
  }
};

  const features = [
    {
      title: 'Risk & blocker detection',
      desc: 'Donna reads between the lines — escalations, deadline slips, and stalled approvals surface before they become fires.',
      icon: '⚡',
    },
    {
      title: 'Executive briefings on demand',
      desc: 'A concise intelligence summary, every morning. No inbox archaeology required.',
      icon: '📋',
    },
    {
      title: 'Cross-channel synthesis',
      desc: 'Gmail, Slack, and Drive read together. Dependencies that span tools, finally visible.',
      icon: '🔗',
    },
  ];

  const securityItems = [
    ['Read-only scope', 'Donna cannot send, delete, or modify any email.'],
    ['Zero email storage', 'Your content is processed in-memory, never persisted.'],
    ['Revoke anytime', 'Disconnect from Google account settings instantly.'],
  ];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: '100vh',
        position: 'relative',
        fontFamily: T.sans,
        overflowX: 'clip',
        background: T.bg,
      }}
    >
      <AmbientBg />
      <NoiseOverlay />
      <Ticker />
      <Navbar />

      {/* ══════ HERO SECTION ══════ */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        id="hero"
      >
        <div style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(110px, 20vw, 140px) clamp(16px, 5vw, 24px) 80px',
          background: T.gradientHero,
        }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 100,
              border: `1px solid ${T.borderHot}`,
              background: 'rgba(232,160,48,0.06)',
              marginBottom: 36,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: T.amber }}
            />
            {/* <span style={{
              fontFamily: T.mono,
              fontSize: 10,
              color: T.amberDim,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
              Now in Beta
            </span> */}
          </motion.div>

          {/* Main headline — Vite-style bold */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: T.display,
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: T.text,
              marginBottom: 24,
              maxWidth: 900,
            }}
          >
            Your inbox knows things
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #E8A030 0%, #F5C878 50%, #E8A030 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              you don't
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            style={{
              fontFamily: T.sans,
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: T.textMid,
              lineHeight: 1.7,
              maxWidth: 560,
              marginBottom: 40,
            }}
          >
            Donna surfaces risks, blockers, and opportunities hiding in your
            email — before they become problems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: 64,
            }}
          >
            <motion.button
              onClick={() => document.getElementById('connect').scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.03, boxShadow: '0 0 32px rgba(232,160,48,0.30)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '14px 32px',
                background: T.amber,
                color: T.bg,
                border: 'none',
                borderRadius: 10,
                fontFamily: T.mono,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 0 20px rgba(232,160,48,0.20)',
                transition: 'all 0.3s ease',
              }}
            >
              <GmailSVG />
              Connect Gmail
            </motion.button>

            <motion.button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '14px 32px',
                background: 'transparent',
                color: T.textMid,
                border: `1.5px solid ${T.border}`,
                borderRadius: 10,
                fontFamily: T.mono,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Learn more
            </motion.button>
          </motion.div>

          {/* Terminal */}
          <Terminal />

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(24px, 4vw, 64px)',
              maxWidth: 720,
              width: '100%',
              borderTop: `1px solid ${T.border}`,
              marginTop: 20,
            }}
          >
            <StatCard value="4.2h" label="Saved per exec / week" delay={1.1} />
            <StatCard value="94%" label="Signal accuracy" delay={1.2} />
            <StatCard value="< 30s" label="To first briefing" delay={1.3} />
          </motion.div>
        </div>
      </motion.section>

      {/* ══════ FEATURES SECTION ══════ */}
      <section id="features" style={{
        position: 'relative',
        zIndex: 10,
        padding: 'clamp(60px, 12vw, 120px) clamp(16px, 5vw, 24px)',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
          }}>
            <div style={{ width: 20, height: 1, background: T.amberDim }} />
            <span style={{
              fontFamily: T.mono,
              fontSize: 10,
              letterSpacing: '0.24em',
              color: T.amberDim,
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
              Capabilities
            </span>
            <div style={{ width: 20, height: 1, background: T.amberDim }} />
          </div>

          <h2 style={{
            fontFamily: T.display,
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            color: T.text,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: 16,
          }}>
            Intelligence that works
            <br />
            <span style={{ color: T.amberDim }}>while you sleep</span>
          </h2>

          <p style={{
            fontFamily: T.sans,
            fontSize: 17,
            color: T.textMid,
            lineHeight: 1.7,
            maxWidth: 520,
            margin: '0 auto',
          }}>
            Donna connects to your tools and continuously monitors for signals
            that matter to your business.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              index={i + 1}
              {...f}
              delay={0.1 + i * 0.1}
            />
          ))}
        </div>
      </section>

      {/* ══════ CONNECT SECTION ══════ */}
      <section id="connect" style={{
        position: 'relative',
        zIndex: 10,
        padding: '100px 24px 140px',
      }}>
        <div style={{
          maxWidth: 480,
          margin: '0 auto',
          textAlign: 'center',
        }}>
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 32,
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 18, height: 1, background: T.amberDim }} />
            <span style={{
              fontFamily: T.mono,
              fontSize: 10,
              letterSpacing: '0.24em',
              color: T.amberDim,
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
              Get access
            </span>
            <div style={{ width: 18, height: 1, background: T.amberDim }} />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: T.display,
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 700,
              color: T.text,
              lineHeight: 1.2,
              marginBottom: 16,
              letterSpacing: '-0.03em',
            }}
          >
            Start your first
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #E8A030 0%, #F5C878 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              intelligence run
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontFamily: T.sans,
              fontSize: 15,
              color: T.textMid,
              lineHeight: 1.75,
              marginBottom: 40,
            }}
          >
            Grant read-only Gmail access and Donna will have your first
            briefing ready in under a minute.
          </motion.p>

          {/* Security callouts */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6 }}
            style={{
              marginBottom: 36,
              textAlign: 'left',
              background: 'rgba(255,255,255,0.015)',
              borderRadius: 14,
              border: `1px solid ${T.border}`,
              padding: '8px 24px',
            }}
          >
            {securityItems.map(([title, desc]) => (
              <SecurityBadge key={title} title={title} desc={desc} />
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <ConnectButton state={connectState} onClick={handleConnect} />

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: T.mono,
                    fontSize: 11,
                    color: 'rgba(248,113,113,0.8)',
                    textAlign: 'center',
                    marginTop: 14,
                    overflow: 'hidden',
                    letterSpacing: '0.04em',
                  }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: T.mono,
              fontSize: 10,
              color: T.textMuted,
              textAlign: 'center',
              marginTop: 28,
              letterSpacing: '0.04em',
              lineHeight: 1.7,
            }}
          >
            By connecting, you agree to Donna's{' '}
            <span style={{
              borderBottom: `1px solid rgba(242,240,235,0.12)`,
              paddingBottom: 1,
              cursor: 'pointer',
              color: T.textFaint,
            }}>
              Terms
            </span>{' '}
            &{' '}
            <span style={{
              borderBottom: `1px solid rgba(242,240,235,0.12)`,
              paddingBottom: 1,
              cursor: 'pointer',
              color: T.textFaint,
            }}>
              Privacy Policy
            </span>
            .
          </motion.p>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer
        className="signup-footer"
        style={{
          position: 'relative',
          zIndex: 10,
          borderTop: `1px solid ${T.border}`,
          background: 'rgba(10,10,15,0.80)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 20, height: 20,
            border: `1.5px solid ${T.amber}`,
            borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 7, height: 7,
              background: T.amber, borderRadius: 2,
            }} />
          </div>
          <span style={{
            fontFamily: T.mono,
            fontSize: 11,
            color: T.textFaint,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>
            Donna
          </span>
        </div>

        <span style={{
          fontFamily: T.mono,
          fontSize: 10,
          color: T.textMuted,
          letterSpacing: '0.1em',
        }}>
          © 2025
        </span>

        <motion.div
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: T.amberDim }}
        />
      </footer>
    </motion.div>
  );
}
