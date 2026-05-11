<div align="center">
  <img src="./public/favicon.svg" alt="Donna Logo" width="100" height="100">
  <h1 align="center">DONNA</h1>
  <p align="center">
    <strong>Executive Intelligence Platform</strong>
  </p>
  <p align="center">
    Surface critical risks, blockers, and dependencies across your organizational communication — automatically.
  </p>

  <p align="center">
    <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black">
    <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white">
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white">
    <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white">
  </p>
</div>

---

## ✨ Overview

**Donna** is an AI-powered chief-of-staff dashboard designed for non-technical executives. It connects to your organizational communication (via Gmail), analyzes recent activity using Gemini AI, and surfaces a highly readable, actionable intelligence dashboard.

Say goodbye to inbox overwhelm. Donna extracts the signal from the noise.

## 🚀 Key Features

- **Automated Intelligence**: Connects to your Gmail via a secure OAuth flow.
- **Risk Detection**: Automatically flags critical, high, and medium-level risks hiding in your inbox.
- **Action Items Tracker**: Generates prioritized, checkable action items so you know exactly what needs your attention.
- **Dependency Mapping**: Highlights key people and teams involved, specifically flagging critical dependencies and blockers (e.g., OOO alerts).
- **Executive Briefs**: One-click, copyable summaries for quick distribution.
- **Historical Patterns**: Connects the dots on recurring issues across your communications.
- **Privacy First**: Donna uses strict read-only access. Your raw emails never leave your server.

## 🎨 Design & Architecture

Donna is built with a premium, executive-focused aesthetic:
- **Dark & Minimal**: Deep space backgrounds (`#0A0A0F`) with subtle glassmorphism and purple accents (`#7C3AED`).
- **Zero Clutter**: Every element earns its place. No confusing technical jargon.
- **Fluid Motion**: Powered by Framer Motion for smooth, staggered card entrances, state transitions, and purposeful micro-interactions.
- **Typography**: Clean, highly readable interfaces powered by DM Sans and SF Pro Display.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- The **Donna Backend** (running locally on port 3000)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/donna-frontend.git
   cd donna-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Launch the application:**
   Navigate to `http://localhost:5173` in your browser.

## 🔗 Architecture Integration

This React/Vite frontend relies on a separate Node.js/Express backend that handles:
1. Google OAuth2 token exchange and persistence.
2. Direct communication with the Gmail API.
3. Secure prompt construction and calls to Google's Gemini AI.
4. Database storage via Supabase.

Ensure your backend is running before attempting to connect Gmail through the dashboard.

## 🛡️ Security Signals

- 🔒 **Read-only access**: Google OAuth scopes are strictly limited to `gmail.readonly`.
- 🛡️ **Secure storage**: Data is persisted in Supabase with RLS (Row Level Security).
- ⚡ **Powered by Gemini**: State-of-the-art analysis without the manual work.

---
<div align="center">
  <p>Built with 💜 for absolute clarity.</p>
</div>
