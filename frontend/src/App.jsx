// ═══════════════════════════════════════════════════════════════
// ARENA AGENT - PREMIUM ULTIMATE EDITION
// Complete redesign with glassmorphism, AI showcase, fixed loading
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { 
  Wallet, Menu, X, Sun, Moon, RefreshCw, ExternalLink,
  Github, Twitter, MessageCircle, Sparkles
} from 'lucide-react'
import { HeroSection, StatsDashboard, GameModesShowcase, AIAgentSection, PremiumLoader } from './components-PREMIUM'
import { ArenaGrid } from './PremiumArenaCard'

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://arena-agent-backend.onrender.com/api"

// ═══════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [arenas, setArenas] = useState([])
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [theme, setTheme] = useState('dark')
  const [mobileNav, setMobileNav] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // ═══════════════════════════════════════════════════════════════
  // FETCH ARENAS - WITH RETRY LOGIC
  // ═══════════════════════════════════════════════════════════════

  const fetchArenas = useCallback(async (retry = 0) => {
    try {
      console.log(`🔍 Fetching arenas (attempt ${retry + 1})...`)
      console.log(`📡 URL: ${BACKEND}/arenas`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      const res = await fetch(`${BACKEND}/arenas`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      clearTimeout(timeoutId)
      
      console.log(`📡 Response status: ${res.status} ${res.statusText}`)
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      
      const data = await res.json()
      console.log(`📦 Response type: ${Array.isArray(data) ? 'Array' : 'Object'}`)
      console.log(`📦 Data preview:`, JSON.stringify(data).substring(0, 100))
      
      // Handle both {"arenas": [...]} and [...] formats
      const arenasArray = data.arenas || data
      
      if (!Array.isArray(arenasArray)) {
        console.error('❌ Data is not an array:', typeof arenasArray)
        throw new Error('Invalid response format')
      }
      
      console.log(`✅ Loaded ${arenasArray.length} arenas`)
      setArenas(arenasArray)
      setError(null)
      setRetryCount(0)
      
    } catch (err) {
      console.error('💥 Fetch error:', err)
      
      // Retry logic
      if (retry < 3) {
        console.log(`🔄 Retrying in ${(retry + 1) * 2}s...`)
        setTimeout(() => {
          setRetryCount(retry + 1)
          fetchArenas(retry + 1)
        }, (retry + 1) * 2000)
        return
      }
      
      setError(err.message)
      setArenas([])
      showToast('Failed to load arenas. Check console for details.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArenas()
  }, [fetchArenas])

  // ═══════════════════════════════════════════════════════════════
  // WALLET CONNECTION
  // ═══════════════════════════════════════════════════════════════

  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast('MetaMask not detected!', 'error')
      return
    }
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      setWallet(accounts[0])
      showToast('Wallet connected!', 'success')
    } catch (err) {
      console.error('Wallet error:', err)
      showToast('Failed to connect wallet', 'error')
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TOAST NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // ═══════════════════════════════════════════════════════════════
  // CALCULATE STATS
  // ═══════════════════════════════════════════════════════════════

  const stats = {
    total: arenas.length,
    active: arenas.filter(a => a.status === 'open').length,
    inProgress: arenas.filter(a => a.status === 'in-progress').length,
    completed: arenas.filter(a => a.status === 'completed').length
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER - PREMIUM UI
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="app">
      {/* Premium Navigation */}
      <nav className="glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(110, 84, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6E54FF, #85E6FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            boxShadow: '0 4px 12px rgba(110, 84, 255, 0.4)'
          }}>
            ⚡
          </div>
          <div>
            <div style={{ 
              fontSize: '1.3rem', 
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              ARENA AGENT
            </div>
            <div style={{ 
              fontSize: '0.7rem', 
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              AI-Powered Gaming
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            className="btn btn-ghost btn-icon"
            onClick={() => fetchArenas()}
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          
          {wallet ? (
            <div className="glass" style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00FF88'
              }} />
              {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </div>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              <Wallet size={18} />
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection onGetStarted={() => {
        document.getElementById('arenas')?.scrollIntoView({ behavior: 'smooth' })
      }} />

      {/* Stats Dashboard */}
      <div style={{ padding: '0 24px', maxWidth: '1400px', margin: '0 auto' }}>
        <StatsDashboard stats={stats} />
      </div>

      {/* Game Modes Showcase */}
      <GameModesShowcase />

      {/* AI Agent Section */}
      <AIAgentSection />

      {/* Arenas Section */}
      <div id="arenas" style={{ 
        padding: '64px 24px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #6E54FF, #85E6FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Live Arenas
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}>
            Join active competitions or create your own
          </p>
        </div>

        {loading ? (
          <PremiumLoader text={retryCount > 0 ? `Retrying... (${retryCount}/3)` : "Loading arenas..."} />
        ) : error ? (
          <div className="glass" style={{
            padding: '48px',
            textAlign: 'center',
            borderRadius: '16px',
            border: '1px solid rgba(255, 142, 228, 0.3)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😞</div>
            <div style={{ fontSize: '1.3rem', marginBottom: '12px', color: '#FF8EE4' }}>
              Failed to Load Arenas
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              {error}
            </div>
            <button className="btn btn-primary" onClick={() => fetchArenas()}>
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        ) : (
          <ArenaGrid 
            arenas={arenas} 
            onArenaClick={(arena) => {
              console.log('Arena clicked:', arena)
              showToast(`Opening ${arena.title}...`, 'info')
            }} 
          />
        )}
      </div>

      {/* Premium Footer */}
      <footer style={{
        padding: '64px 24px',
        borderTop: '2px solid',
        borderImage: 'linear-gradient(90deg, #6E54FF, #85E6FF, #FF8EE4) 1',
        background: 'linear-gradient(180deg, transparent 0%, rgba(26, 15, 58, 0.4) 100%)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6E54FF, #85E6FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                ⚡
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>ARENA AGENT</div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
              Autonomous AI gaming agent with on-chain wagering. Built for the Moltiverse Hackathon 2026.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1.1rem' }}>
              Powered By
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              color: 'rgba(255,255,255,0.7)'
            }}>
              <div>🤖 Llama 3.3 70B (Groq)</div>
              <div>⛓️ Monad Blockchain</div>
              <div>⚛️ React + Vite</div>
              <div>🎨 Premium UI/UX</div>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1.1rem' }}>
              Connect
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-icon btn-ghost">
                <Github size={20} />
              </button>
              <button className="btn btn-icon btn-ghost">
                <Twitter size={20} />
              </button>
              <button className="btn btn-icon btn-ghost">
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '48px auto 0',
          paddingTop: '24px',
          borderTop: '1px solid rgba(110, 84, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.5)'
        }}>
          <div>© 2026 Arena Agent • Moltiverse Hackathon</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#85E6FF" />
            Built with AI
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '16px 24px',
          background: toast.type === 'error' 
            ? 'rgba(255, 100, 100, 0.95)' 
            : toast.type === 'success'
            ? 'rgba(0, 255, 136, 0.95)'
            : 'rgba(110, 84, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          color: 'white',
          fontWeight: 600,
          zIndex: 1000,
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
