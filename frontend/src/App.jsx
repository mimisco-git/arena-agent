// ═══════════════════════════════════════════════════════════════
// ARENA AGENT - BULLETPROOF EDITION
// Auto wake-up backend + smart retry + 404 handling
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { 
  Wallet, RefreshCw, Github, Twitter, MessageCircle, Sparkles
} from 'lucide-react'
import { HeroSection, StatsDashboard, GameModesShowcase, AIAgentSection, PremiumLoader } from './components-PREMIUM'
import { ArenaGrid } from './PremiumArenaCard'

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://arena-agent-backend.onrender.com/api"

// ═══════════════════════════════════════════════════════════════
// WAKE UP BACKEND FIRST
// ═══════════════════════════════════════════════════════════════

async function wakeBackend() {
  console.log('🔔 Waking backend...')
  try {
    await fetch(`${BACKEND}/health`, { method: 'GET' })
    await new Promise(r => setTimeout(r, 2000)) // Wait 2s
    console.log('✅ Backend awake')
    return true
  } catch (err) {
    console.log('⏳ Backend starting...')
    return false
  }
}

// ═══════════════════════════════════════════════════════════════
// SMART FETCH WITH RETRY
// ═══════════════════════════════════════════════════════════════

async function smartFetch(attempt = 1, maxAttempts = 5) {
  try {
    console.log(`🔍 Fetch attempt ${attempt}/${maxAttempts}`)
    
    // First attempt: wake backend
    if (attempt === 1) {
      await wakeBackend()
    }
    
    const res = await fetch(`${BACKEND}/arenas`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000)
    })
    
    console.log(`📡 ${res.status} ${res.statusText}`)
    
    // Handle 404 (backend sleeping)
    if (res.status === 404 && attempt < maxAttempts) {
      console.log('⏳ 404 - Backend sleeping, retry in 3s...')
      await new Promise(r => setTimeout(r, 3000))
      return smartFetch(attempt + 1, maxAttempts)
    }
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    
    const data = await res.json()
    const arenas = data.arenas || data
    
    if (!Array.isArray(arenas)) {
      throw new Error('Invalid format')
    }
    
    console.log(`✅ Loaded ${arenas.length} arenas`)
    return { ok: true, data: arenas }
    
  } catch (err) {
    console.error(`❌ Attempt ${attempt} failed:`, err.message)
    
    if (attempt >= maxAttempts) {
      return { ok: false, error: err.message }
    }
    
    // Exponential backoff
    const wait = Math.min(2000 * attempt, 8000)
    console.log(`⏳ Retry in ${wait/1000}s...`)
    await new Promise(r => setTimeout(r, wait))
    return smartFetch(attempt + 1, maxAttempts)
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [arenas, setArenas] = useState([])
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const loadArenas = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    const result = await smartFetch()
    
    if (result.ok) {
      setArenas(result.data)
      showToast('Arenas loaded!', 'success')
    } else {
      setError(result.error)
      showToast('Failed to load', 'error')
    }
    
    setLoading(false)
  }, [])

  useEffect(() => { loadArenas() }, [loadArenas])

  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast('MetaMask not detected!', 'error')
      return
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setWallet(accounts[0])
      showToast('Wallet connected!', 'success')
    } catch (err) {
      showToast('Failed to connect', 'error')
    }
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const stats = {
    total: arenas.length,
    active: arenas.filter(a => a.status === 'open').length,
    inProgress: arenas.filter(a => a.status === 'in-progress').length,
    completed: arenas.filter(a => a.status === 'completed').length
  }

  return (
    <div className="app">
      <nav className="glass" style={{
        position: 'sticky', top: 0, zIndex: 100, padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(110, 84, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #6E54FF, #85E6FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', boxShadow: '0 4px 12px rgba(110, 84, 255, 0.4)'
          }}>⚡</div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              ARENA AGENT
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>
              AI-Powered Gaming
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn btn-ghost btn-icon" onClick={loadArenas} title="Refresh">
            <RefreshCw size={18} />
          </button>
          {wallet ? (
            <div className="glass" style={{
              padding: '8px 16px', borderRadius: '9999px', display: 'flex',
              alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontFamily: 'JetBrains Mono, monospace'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00FF88' }} />
              {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </div>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              <Wallet size={18} /> Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <HeroSection onGetStarted={() => document.getElementById('arenas')?.scrollIntoView({ behavior: 'smooth' })} />
      
      <div style={{ padding: '0 24px', maxWidth: '1400px', margin: '0 auto' }}>
        <StatsDashboard stats={stats} />
      </div>
      
      <GameModesShowcase />
      <AIAgentSection />

      <div id="arenas" style={{ padding: '64px 24px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '16px',
            background: 'linear-gradient(135deg, #6E54FF, #85E6FF)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Live Arenas</h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}>
            Join active competitions or create your own
          </p>
        </div>

        {loading ? (
          <PremiumLoader text="Waking backend & loading..." />
        ) : error ? (
          <div className="glass" style={{
            padding: '48px', textAlign: 'center', borderRadius: '16px',
            border: '1px solid rgba(255, 142, 228, 0.3)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😞</div>
            <div style={{ fontSize: '1.3rem', marginBottom: '12px', color: '#FF8EE4' }}>
              Failed to Load Arenas
            </div>
            <div style={{ 
              color: 'rgba(255,255,255,0.6)', marginBottom: '24px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem'
            }}>{error}</div>
            <button className="btn btn-primary" onClick={loadArenas}>
              <RefreshCw size={18} /> Try Again
            </button>
          </div>
        ) : (
          <ArenaGrid arenas={arenas} onArenaClick={(arena) => {
            console.log('Arena clicked:', arena)
            showToast(`Opening ${arena.title}...`, 'info')
          }} />
        )}
      </div>

      <footer style={{
        padding: '64px 24px', borderTop: '2px solid',
        borderImage: 'linear-gradient(90deg, #6E54FF, #85E6FF, #FF8EE4) 1',
        background: 'linear-gradient(180deg, transparent 0%, rgba(26, 15, 58, 0.4) 100%)'
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #6E54FF, #85E6FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
              }}>⚡</div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>ARENA AGENT</div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
              Autonomous AI gaming agent with on-chain wagering. Built for Moltiverse Hackathon 2026.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1.1rem' }}>Powered By</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'rgba(255,255,255,0.7)' }}>
              <div>🤖 Llama 3.3 70B (Groq)</div>
              <div>⛓️ Monad Blockchain</div>
              <div>⚛️ React + Vite</div>
              <div>🎨 Premium UI/UX</div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1.1rem' }}>Connect</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-icon btn-ghost"><Github size={20} /></button>
              <button className="btn btn-icon btn-ghost"><Twitter size={20} /></button>
              <button className="btn btn-icon btn-ghost"><MessageCircle size={20} /></button>
            </div>
          </div>
        </div>
        <div style={{
          maxWidth: '1200px', margin: '48px auto 0', paddingTop: '24px',
          borderTop: '1px solid rgba(110, 84, 255, 0.2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)'
        }}>
          <div>© 2026 Arena Agent • Moltiverse Hackathon</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#85E6FF" /> Built with AI
          </div>
        </div>
      </footer>

      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', padding: '16px 24px',
          background: toast.type === 'error' ? 'rgba(255, 100, 100, 0.95)' : 
                      toast.type === 'success' ? 'rgba(0, 255, 136, 0.95)' : 'rgba(110, 84, 255, 0.95)',
          backdropFilter: 'blur(20px)', borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)', color: 'white',
          fontWeight: 600, zIndex: 1000, animation: 'fadeInUp 0.3s ease-out'
        }}>{toast.message}</div>
      )}
    </div>
  )
}
