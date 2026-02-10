// ═══════════════════════════════════════════════════════════════
// ARENA AGENT - HACKATHON READY VERSION
// Real Monad integration + Faucet + Theme toggle
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { Wallet, RefreshCw, Github, Twitter, MessageCircle, Sparkles, X, Users, Clock, Trophy, Zap, Shield, Sun, Moon, Droplet, Network, AlertCircle } from 'lucide-react'
import { HeroSection, StatsDashboard, GameModesShowcase, AIAgentSection, PremiumLoader } from './components-PREMIUM'
import { ArenaGrid } from './PremiumArenaCard'
import { FaucetModal } from './FaucetModal'
import { switchToMonad, getMonBalance, isMonadNetwork } from './monadConfig'

const BACKEND = "https://arena-agent-backend.onrender.com/api"

// ═══════════════════════════════════════════════════════════════
// THEME HOOK
// ═══════════════════════════════════════════════════════════════

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('arena-agent-theme')
    if (saved) return saved
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light'
    }
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('arena-agent-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}

// ═══════════════════════════════════════════════════════════════
// THEME TOGGLE BUTTON
// ═══════════════════════════════════════════════════════════════

function ThemeToggle({ theme, onToggle }) {
  return (
    <button 
      onClick={onToggle}
      className="theme-toggle"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        position: 'relative',
        width: '60px',
        height: '32px',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-full)',
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '3px',
        left: theme === 'dark' ? '3px' : '31px',
        width: '24px',
        height: '24px',
        background: 'linear-gradient(135deg, var(--monad-purple), var(--monad-cyan))',
        borderRadius: '50%',
        transition: 'left var(--transition-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        {theme === 'dark' ? <Moon size={14} color="white" /> : <Sun size={14} color="white" />}
      </div>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════
// ARENA MODAL
// ═══════════════════════════════════════════════════════════════

const gameTypeConfig = {
  0: { name: "Prediction", icon: "🔮", color: "#6E54FF" },
  1: { name: "Trivia", icon: "📖", color: "#85E6FF" },
  2: { name: "Trading", icon: "📈", color: "#FF8EE4" },
  3: { name: "Strategy", icon: "⚔️", color: "#FFAE45" }
}

function ArenaModal({ arena, onClose, onJoin }) {
  if (!arena) return null
  
  const config = gameTypeConfig[arena.gameType] || gameTypeConfig[0]
  const now = Math.floor(Date.now() / 1000)
  const timeRemaining = arena.endTime - now
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  
  const isOpen = arena.status === 'open'
  const isFull = arena.players.length >= arena.maxPlayers
  const canJoin = isOpen && !isFull

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      
      <div className="glass" style={{
        maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
        borderRadius: '24px', border: `2px solid ${config.color}44`,
        position: 'relative', animation: 'slideUp 0.3s ease-out'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{
          background: `linear-gradient(135deg, ${config.color}22, ${config.color}11)`,
          borderBottom: `1px solid ${config.color}33`, padding: '32px', position: 'relative'
        }}>
          <button onClick={onClose} className="btn btn-ghost btn-icon"
            style={{ position: 'absolute', top: '16px', right: '16px' }}>
            <X size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '12px',
              background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', boxShadow: `0 8px 24px ${config.color}44`
            }}>
              {config.icon}
            </div>
            <div>
              <div style={{
                padding: '4px 12px', borderRadius: '9999px',
                background: `${config.color}22`, border: `1px solid ${config.color}44`,
                fontSize: '0.85rem', fontWeight: 600, color: config.color,
                display: 'inline-block', marginBottom: '6px'
              }}>
                {config.name}
              </div>
              <h2 style={{
                fontSize: '1.6rem', fontWeight: 700, margin: 0,
                fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)'
              }}>
                {arena.title}
              </h2>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '16px', padding: '24px 32px',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Users size={12} style={{ display: 'inline' }} /> PLAYERS
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: config.color }}>
              {arena.players.length}/{arena.maxPlayers}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Trophy size={12} style={{ display: 'inline' }} /> PRIZE
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#FFAE45' }}>
              {(parseFloat(arena.betAmount) * arena.maxPlayers).toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Clock size={12} style={{ display: 'inline' }} /> TIME
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#85E6FF' }}>
              {timeRemaining > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : 'ENDED'}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Zap size={12} style={{ display: 'inline' }} /> ENTRY
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: config.color }}>
              {arena.betAmount}
            </div>
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          <h3 style={{
            fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)'
          }}>
            <Shield size={20} color={config.color} />
            How to Play
          </h3>
          <p style={{ color: 'var(--text-tertiary)', lineHeight: '1.6' }}>
            {config.name === 'Prediction' && 'AI generates scenarios. Vote on outcomes. Closest predictions win the prize pool.'}
            {config.name === 'Trivia' && 'Answer AI-generated questions. Highest score wins. Test your knowledge!'}
            {config.name === 'Trading' && 'Simulated markets. Best portfolio returns win. Make smart trades!'}
            {config.name === 'Strategy' && 'Card-based battles. Outsmart opponents. Strategic choices win!'}
          </p>
        </div>

        <div style={{
          padding: '20px 32px', borderTop: '1px solid var(--glass-border)',
          display: 'flex', gap: '12px', alignItems: 'center'
        }}>
          {canJoin ? (
            <>
              <button className="btn btn-primary" style={{
                flex: 1, background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`,
                boxShadow: `0 4px 16px ${config.color}44`
              }} onClick={() => onJoin(arena)}>
                <Zap size={18} />
                Join Arena - {arena.betAmount} MON
              </button>
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            </>
          ) : (
            <div style={{ 
              flex: 1, textAlign: 'center', padding: '12px',
              background: 'var(--glass-bg)', borderRadius: '12px',
              border: '1px solid var(--glass-border)', color: 'var(--text-secondary)'
            }}>
              {isFull ? `Arena is Full (${arena.maxPlayers}/${arena.maxPlayers})` : 'Arena has Ended'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// FETCH ARENAS
// ═══════════════════════════════════════════════════════════════

async function fetchArenas() {
  try {
    await fetch(`${BACKEND}/health`)
    await new Promise(r => setTimeout(r, 2000))
    const res = await fetch(`${BACKEND}/arenas`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return { ok: true, data: data.arenas || data }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [arenas, setArenas] = useState([])
  const [wallet, setWallet] = useState(null)
  const [monBalance, setMonBalance] = useState('0')
  const [isMonad, setIsMonad] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [selectedArena, setSelectedArena] = useState(null)
  const [showFaucet, setShowFaucet] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const result = await fetchArenas()
      if (result.ok) {
        setArenas(result.data)
        showToast('Arenas loaded!', 'success')
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (wallet) {
      checkNetwork()
      updateBalance()
    }
  }, [wallet])

  const checkNetwork = async () => {
    const onMonad = await isMonadNetwork()
    setIsMonad(onMonad)
    
    if (!onMonad) {
      showToast('Please switch to Monad Testnet', 'warning')
    }
  }

  const updateBalance = async () => {
    if (wallet) {
      const balance = await getMonBalance(wallet)
      setMonBalance(balance)
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast('MetaMask not detected!', 'error')
      return
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setWallet(accounts[0])
      showToast('Wallet connected!', 'success')
      
      // Auto-switch to Monad
      const result = await switchToMonad()
      if (result.success) {
        setIsMonad(true)
        showToast('Switched to Monad Testnet!', 'success')
      }
    } catch (err) {
      showToast('Failed to connect wallet', 'error')
    }
  }

  const handleSwitchNetwork = async () => {
    const result = await switchToMonad()
    if (result.success) {
      setIsMonad(true)
      showToast('Switched to Monad Testnet!', 'success')
      updateBalance()
    } else {
      showToast('Failed to switch network', 'error')
    }
  }

  const handleJoinArena = (arena) => {
    if (!wallet) {
      showToast('Please connect your wallet first!', 'error')
      setSelectedArena(null)
      return
    }
    
    if (!isMonad) {
      showToast('Please switch to Monad Testnet first!', 'warning')
      setSelectedArena(null)
      return
    }

    if (parseFloat(monBalance) < parseFloat(arena.betAmount)) {
      showToast('Insufficient MON balance! Get tokens from faucet.', 'error')
      setSelectedArena(null)
      setShowFaucet(true)
      return
    }
    
    showToast(`Joining ${arena.title}... (Smart contract integration coming soon!)`, 'info')
    setSelectedArena(null)
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
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #6E54FF, #85E6FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', boxShadow: '0 4px 12px rgba(110, 84, 255, 0.4)'
          }}>⚡</div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
              ARENA AGENT
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>
              AI-Powered Gaming on Monad
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Network Warning */}
          {wallet && !isMonad && (
            <button 
              onClick={handleSwitchNetwork}
              className="btn btn-secondary"
              style={{
                background: 'rgba(255, 174, 69, 0.2)',
                border: '1px solid rgba(255, 174, 69, 0.4)',
                color: '#FFAE45'
              }}
            >
              <AlertCircle size={16} />
              Switch to Monad
            </button>
          )}

          {/* Faucet Button */}
          <button 
            onClick={() => setShowFaucet(true)}
            className="btn btn-secondary"
            style={{
              background: 'linear-gradient(135deg, rgba(133, 230, 255, 0.2), rgba(110, 84, 255, 0.2))',
              border: '1px solid rgba(133, 230, 255, 0.4)'
            }}
          >
            <Droplet size={18} />
            Get MON
          </button>

          {/* Theme Toggle */}
          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          {/* Wallet */}
          {wallet ? (
            <div className="glass" style={{
              padding: '8px 16px', borderRadius: '9999px', display: 'flex',
              alignItems: 'center', gap: '12px', fontSize: '0.9rem', fontFamily: 'JetBrains Mono, monospace'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '2px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isMonad ? '#00FF88' : '#FFAE45' }} />
                  {wallet.slice(0, 6)}...{wallet.slice(-4)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {monBalance} MON
                </div>
              </div>
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
          <h2 className="gradient-text" style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '16px'
          }}>Live Arenas</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-tertiary)' }}>
            Join active competitions or create your own
          </p>
        </div>

        {loading ? (
          <PremiumLoader text="Loading arenas..." />
        ) : (
          <ArenaGrid arenas={arenas} onArenaClick={setSelectedArena} />
        )}
      </div>

      <footer style={{
        padding: '64px 24px', borderTop: '2px solid',
        borderImage: 'linear-gradient(90deg, #6E54FF, #85E6FF, #FF8EE4) 1',
        background: 'var(--bg-tertiary)'
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
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>ARENA AGENT</div>
            </div>
            <p style={{ color: 'var(--text-tertiary)', lineHeight: '1.6' }}>
              Autonomous AI gaming agent with on-chain wagering. Built for Moltiverse Hackathon 2026.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Powered By</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-tertiary)' }}>
              <div>🤖 Llama 3.3 70B (Groq)</div>
              <div>⛓️ Monad Testnet</div>
              <div>⚛️ React + Vite</div>
              <div>🎨 Premium UI/UX</div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Hackathon</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-tertiary)' }}>
              <div>🦞 Moltiverse 2026</div>
              <div>💰 $200K Prize Pool</div>
              <div>📅 Feb 2-18, 2026</div>
              <a 
                href="https://moltiverse.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#85E6FF', textDecoration: 'none' }}
              >
                moltiverse.dev →
              </a>
            </div>
          </div>
        </div>
        <div style={{
          maxWidth: '1200px', margin: '48px auto 0', paddingTop: '24px',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px', fontSize: '0.9rem', color: 'var(--text-muted)'
        }}>
          <div>© 2026 Arena Agent • Moltiverse Hackathon</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#85E6FF" />
            Built by BusyBrain Devs
          </div>
        </div>
      </footer>

      {selectedArena && (
        <ArenaModal 
          arena={selectedArena}
          onClose={() => setSelectedArena(null)}
          onJoin={handleJoinArena}
        />
      )}

      {showFaucet && (
        <FaucetModal onClose={() => setShowFaucet(false)} />
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', padding: '16px 24px',
          background: toast.type === 'error' ? 'rgba(255, 100, 100, 0.95)' : 
                      toast.type === 'success' ? 'rgba(0, 255, 136, 0.95)' : 
                      toast.type === 'warning' ? 'rgba(255, 174, 69, 0.95)' :
                      'rgba(110, 84, 255, 0.95)',
          backdropFilter: 'blur(20px)', borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)', color: 'white',
          fontWeight: 600, zIndex: 1000, animation: 'fadeInUp 0.3s ease-out'
        }}>{toast.message}</div>
      )}
    </div>
  )
}
