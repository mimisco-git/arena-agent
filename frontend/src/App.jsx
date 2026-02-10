// ═══════════════════════════════════════════════════════════════
// ARENA AGENT - ULTRA PREMIUM FINAL VERSION
// The most premium Web3 gaming interface ever created
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { Wallet, Moon, Sun, Droplet, X, Users, Clock, Trophy, Zap, Shield, AlertCircle, ExternalLink, Github, Twitter, MessageCircle, Sparkles } from 'lucide-react'
import { UltraPremiumHero, UltraPremiumStats, UltraPremiumGameModes, UltraPremiumAISection, UltraPremiumLoader } from './components-PREMIUM'
import { UltraPremiumArenaGrid } from './PremiumArenaCard'
import { FaucetModal } from './FaucetModal'
import { switchToMonad, getMonBalance, isMonadNetwork } from './monadConfig'

const BACKEND = "https://arena-agent-backend.onrender.com/api"

// ═══════════════════════════════════════════════════════════════
// ULTRA-PREMIUM ARENA MODAL
// ═══════════════════════════════════════════════════════════════

const gameTypeConfig = {
  0: { name: "Prediction", icon: "🔮", gradient: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "#7C3AED" },
  1: { name: "Trivia", icon: "📖", gradient: "linear-gradient(135deg, #06B6D4, #0891B2)", color: "#06B6D4" },
  2: { name: "Trading", icon: "📈", gradient: "linear-gradient(135deg, #F59E0B, #FCD34D)", color: "#F59E0B" },
  3: { name: "Strategy", icon: "⚔️", gradient: "linear-gradient(135deg, #A855F7, #7C3AED)", color: "#A855F7" }
}

function UltraPremiumArenaModal({ arena, onClose, onJoin }) {
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
      position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      animation: 'fadeIn 0.3s ease-out'
    }} onClick={onClose}>
      
      <div className="glass-premium" style={{
        maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
        borderRadius: '32px', border: `2px solid ${config.color}60`,
        position: 'relative', animation: 'slideUp 0.4s ease-out',
        boxShadow: `0 24px 72px ${config.color}40, 0 0 64px ${config.color}30`
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${config.color}30, ${config.color}15)`,
          borderBottom: `1px solid ${config.color}40`,
          padding: '40px', position: 'relative'
        }}>
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="btn-glass-premium"
            style={{
              position: 'absolute', top: '24px', right: '24px',
              width: '44px', height: '44px', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
            {/* Icon */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '16px',
              background: config.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', boxShadow: `0 12px 40px ${config.color}50`,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute', inset: '-6px',
                background: config.gradient, borderRadius: '20px',
                opacity: 0.3, filter: 'blur(24px)', zIndex: -1
              }} />
              {config.icon}
            </div>
            
            {/* Title Section */}
            <div style={{ flex: 1 }}>
              <div style={{
                padding: '6px 16px', borderRadius: '9999px',
                background: `${config.color}20`, border: `1px solid ${config.color}50`,
                fontSize: '0.875rem', fontWeight: 700, color: config.color,
                display: 'inline-block', marginBottom: '8px', textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {config.name}
              </div>
              <h2 style={{
                fontSize: '1.75rem', fontWeight: 800, margin: 0,
                fontFamily: 'Space Grotesk, sans-serif', color: 'white', lineHeight: 1.2
              }}>
                {arena.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px', padding: '32px',
          borderBottom: '1px solid rgba(124, 58, 237, 0.2)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Users size={20} color="rgba(255,255,255,0.5)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Players
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: config.color }}>
              {arena.players.length}/{arena.maxPlayers}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Trophy size={20} color="rgba(255,255,255,0.5)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Prize
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B' }}>
              {(parseFloat(arena.betAmount) * arena.maxPlayers).toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Clock size={20} color="rgba(255,255,255,0.5)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Time
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#06B6D4', fontFamily: 'JetBrains Mono, monospace' }}>
              {timeRemaining > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : 'ENDED'}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Zap size={20} color="rgba(255,255,255,0.5)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Entry
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: config.color }}>
              {arena.betAmount}
            </div>
          </div>
        </div>

        {/* How to Play */}
        <div style={{ padding: '40px' }}>
          <h3 style={{
            fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '12px',
            fontFamily: 'Space Grotesk, sans-serif', color: 'white'
          }}>
            <Shield size={24} color={config.color} />
            How to Play
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '1.05rem' }}>
            {config.name === 'Prediction' && 'AI generates market scenarios. Submit your predictions. Closest predictions win the prize pool based on accuracy.'}
            {config.name === 'Trivia' && 'Answer AI-generated questions on crypto, tech, and blockchain. Highest score wins. Test your knowledge!'}
            {config.name === 'Trading' && 'Simulated markets with real-time price action. Best portfolio returns win. Make smart trading decisions!'}
            {config.name === 'Strategy' && 'Card-based tactical battles. Outsmart opponents with strategic moves. Build powerful combos to win!'}
          </p>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '24px 40px',
          borderTop: '1px solid rgba(124, 58, 237, 0.2)',
          display: 'flex', gap: '16px', alignItems: 'center'
        }}>
          {canJoin ? (
            <>
              <button 
                className="btn-premium"
                style={{
                  flex: 1, background: config.gradient,
                  boxShadow: `0 8px 32px ${config.color}50`,
                  justifyContent: 'center', fontSize: '1.05rem', padding: '16px 32px'
                }}
                onClick={() => onJoin(arena)}
              >
                <Zap size={20} />
                Join Arena - {arena.betAmount} MON
              </button>
              <button className="btn-glass-premium" onClick={onClose} style={{ padding: '16px 32px' }}>
                Cancel
              </button>
            </>
          ) : (
            <div style={{ 
              flex: 1, textAlign: 'center', padding: '16px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px', color: '#EF4444', fontWeight: 600, fontSize: '1.05rem'
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
    
    showToast(`Joining ${arena.title}... (Smart contract integration coming!)`, 'info')
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
      {/* Ultra-Premium Navigation */}
      <nav className="glass-premium" style={{
        position: 'sticky', top: 0, zIndex: 100, padding: '20px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(124, 58, 237, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', boxShadow: '0 8px 24px rgba(124, 58, 237, 0.5)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute', inset: '-4px',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              borderRadius: '14px', opacity: 0.3, filter: 'blur(16px)', zIndex: -1
            }} />
            ⚡
          </div>
          <div>
            <div style={{
              fontSize: '1.5rem', fontWeight: 800,
              fontFamily: 'Space Grotesk, sans-serif',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              ARENA AGENT
            </div>
            <div style={{
              fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)',
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 500
            }}>
              AI-Powered Gaming on Monad
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Network Warning */}
          {wallet && !isMonad && (
            <button 
              onClick={handleSwitchNetwork}
              className="btn-premium"
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#EF4444'
              }}
            >
              <AlertCircle size={18} />
              Switch to Monad
            </button>
          )}

          {/* Faucet Button */}
          <button 
            onClick={() => setShowFaucet(true)}
            className="btn-cyan-premium"
          >
            <Droplet size={18} />
            Get MON
          </button>

          {/* Wallet */}
          {wallet ? (
            <div className="glass-premium" style={{
              padding: '10px 20px', borderRadius: '9999px',
              display: 'flex', alignItems: 'center', gap: '12px',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'flex-end', gap: '2px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: isMonad ? '#22C55E' : '#F59E0B',
                    boxShadow: isMonad ? '0 0 8px #22C55E' : '0 0 8px #F59E0B'
                  }} />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {wallet.slice(0, 6)}...{wallet.slice(-4)}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)',
                  fontWeight: 600
                }}>
                  {monBalance} MON
                </div>
              </div>
            </div>
          ) : (
            <button className="btn-primary-premium" onClick={connectWallet}>
              <Wallet size={18} /> Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <UltraPremiumHero onGetStarted={() => document.getElementById('arenas')?.scrollIntoView({ behavior: 'smooth' })} />
      
      {/* Stats Dashboard */}
      <div style={{ padding: '0 32px', maxWidth: '1400px', margin: '0 auto' }}>
        <UltraPremiumStats stats={stats} />
      </div>
      
      {/* Game Modes */}
      <UltraPremiumGameModes />
      
      {/* AI Section */}
      <UltraPremiumAISection />

      {/* Live Arenas */}
      <div id="arenas" style={{ padding: '80px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, marginBottom: '16px',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Live Arenas
          </h2>
          <p style={{
            fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px', margin: '0 auto'
          }}>
            Join active competitions or create your own gaming arena
          </p>
        </div>

        {loading ? (
          <UltraPremiumLoader text="Loading arenas..." />
        ) : (
          <UltraPremiumArenaGrid arenas={arenas} onArenaClick={setSelectedArena} />
        )}
      </div>

      {/* Footer */}
      <footer style={{
        padding: '80px 32px', borderTop: '2px solid',
        borderImage: 'linear-gradient(90deg, #7C3AED, #06B6D4, #F59E0B) 1',
        background: 'linear-gradient(180deg, transparent 0%, rgba(26, 26, 46, 0.5) 100%)'
      }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '64px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
              }}>⚡</div>
              <div style={{
                fontWeight: 800, fontSize: '1.5rem',
                fontFamily: 'Space Grotesk, sans-serif',
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                ARENA AGENT
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '1.05rem' }}>
              Autonomous AI gaming agent with on-chain wagering. Built for Moltiverse Hackathon 2026.
            </p>
          </div>
          
          <div>
            <div style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.25rem', color: 'white' }}>
              Powered By
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem' }}>
              <div>🤖 Llama 3.3 70B (Groq)</div>
              <div>⛓️ Monad Testnet</div>
              <div>⚛️ React + Vite</div>
              <div>🎨 Ultra-Premium UI</div>
            </div>
          </div>
          
          <div>
            <div style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.25rem', color: 'white' }}>
              Hackathon
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem' }}>
              <div>🦞 Moltiverse 2026</div>
              <div>💰 $200K Prize Pool</div>
              <div>📅 Feb 2-18, 2026</div>
              <a 
                href="https://moltiverse.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: '#06B6D4', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontWeight: 600, transition: 'all 0.2s'
                }}
              >
                moltiverse.dev <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
        
        <div style={{
          maxWidth: '1400px', margin: '64px auto 0', paddingTop: '32px',
          borderTop: '1px solid rgba(124, 58, 237, 0.3)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '20px', fontSize: '1rem', color: 'rgba(255,255,255,0.6)'
        }}>
          <div>© 2026 Arena Agent • Moltiverse Hackathon</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="#F59E0B" />
            <span style={{ fontWeight: 600 }}>Built by BusyBrain Devs</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedArena && (
        <UltraPremiumArenaModal 
          arena={selectedArena}
          onClose={() => setSelectedArena(null)}
          onJoin={handleJoinArena}
        />
      )}

      {showFaucet && <FaucetModal onClose={() => setShowFaucet(false)} />}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', right: '32px', padding: '20px 28px',
          background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 
                      toast.type === 'success' ? 'rgba(34, 197, 94, 0.95)' : 
                      toast.type === 'warning' ? 'rgba(245, 158, 11, 0.95)' :
                      'rgba(124, 58, 237, 0.95)',
          backdropFilter: 'blur(24px)', borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)', color: 'white',
          fontWeight: 600, zIndex: 1000, animation: 'fadeInUp 0.4s ease-out',
          fontSize: '1.05rem', border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
