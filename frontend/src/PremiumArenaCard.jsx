// ═══════════════════════════════════════════════════════════════
// ULTRA-PREMIUM ARENA CARD
// Luxury gaming card with advanced effects
// ═══════════════════════════════════════════════════════════════

import { Users, Clock, Trophy, Zap, TrendingUp, Award } from 'lucide-react'
import { useEffect, useState } from 'react'

const gameTypeConfig = {
  0: { 
    name: "Prediction", 
    icon: "🔮", 
    gradient: "linear-gradient(135deg, #7C3AED, #A855F7)",
    color: "#7C3AED"
  },
  1: { 
    name: "Trivia", 
    icon: "📖", 
    gradient: "linear-gradient(135deg, #06B6D4, #0891B2)",
    color: "#06B6D4"
  },
  2: { 
    name: "Trading", 
    icon: "📈", 
    gradient: "linear-gradient(135deg, #F59E0B, #FCD34D)",
    color: "#F59E0B"
  },
  3: { 
    name: "Strategy", 
    icon: "⚔️", 
    gradient: "linear-gradient(135deg, #A855F7, #7C3AED)",
    color: "#A855F7"
  }
}

function UltraPremiumArenaCard({ arena, onClick }) {
  const [timeLeft, setTimeLeft] = useState('')
  const config = gameTypeConfig[arena.gameType] || gameTypeConfig[0]
  
  useEffect(() => {
    const updateTime = () => {
      const now = Math.floor(Date.now() / 1000)
      const remaining = arena.endTime - now
      if (remaining <= 0) {
        setTimeLeft('ENDED')
      } else {
        const mins = Math.floor(remaining / 60)
        const secs = remaining % 60
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`)
      }
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [arena.endTime])

  const isOpen = arena.status === 'open'
  const isFull = arena.players.length >= arena.maxPlayers
  const prizePool = (parseFloat(arena.betAmount) * arena.maxPlayers).toFixed(2)

  return (
    <div 
      className="arena-card-premium"
      onClick={onClick}
      style={{
        position: 'relative',
        isolation: 'isolate'
      }}
    >
      {/* Top Accent Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: config.gradient,
        borderRadius: '24px 24px 0 0',
        boxShadow: `0 0 20px ${config.color}60`
      }} />

      {/* Status Badge */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        padding: '6px 16px',
        background: isOpen && !isFull 
          ? 'rgba(34, 197, 94, 0.15)' 
          : 'rgba(239, 68, 68, 0.15)',
        border: `1px solid ${isOpen && !isFull ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
        borderRadius: '9999px',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 2
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: isOpen && !isFull ? '#22C55E' : '#EF4444',
          boxShadow: `0 0 8px ${isOpen && !isFull ? '#22C55E' : '#EF4444'}`,
          animation: 'pulse 2s ease-in-out infinite'
        }} />
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'white',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {isOpen && !isFull ? 'OPEN' : isFull ? 'FULL' : arena.status}
        </span>
      </div>

      {/* Game Type Icon */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '20px',
        background: config.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
        marginBottom: '20px',
        boxShadow: `0 12px 40px ${config.color}50`,
        position: 'relative',
        marginTop: '8px'
      }}>
        <div style={{
          position: 'absolute',
          inset: '-6px',
          background: config.gradient,
          borderRadius: '24px',
          opacity: 0.3,
          filter: 'blur(20px)',
          zIndex: -1
        }} />
        {config.icon}
      </div>

      {/* Game Type Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        background: `${config.color}20`,
        border: `1px solid ${config.color}40`,
        borderRadius: '9999px',
        marginBottom: '12px'
      }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: config.color,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {config.name}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '1.25rem',
        fontWeight: 700,
        marginBottom: '16px',
        color: 'white',
        lineHeight: 1.3
      }}>
        {arena.title}
      </h3>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {/* Players */}
        <div style={{
          padding: '12px',
          background: 'rgba(124, 58, 237, 0.05)',
          border: '1px solid rgba(124, 58, 237, 0.15)',
          borderRadius: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px'
          }}>
            <Users size={14} color="rgba(255, 255, 255, 0.6)" />
            <span style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 500
            }}>
              PLAYERS
            </span>
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: config.color
          }}>
            {arena.players.length}/{arena.maxPlayers}
          </div>
        </div>

        {/* Prize Pool */}
        <div style={{
          padding: '12px',
          background: 'rgba(245, 158, 11, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.15)',
          borderRadius: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px'
          }}>
            <Trophy size={14} color="rgba(255, 255, 255, 0.6)" />
            <span style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 500
            }}>
              PRIZE
            </span>
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#F59E0B'
          }}>
            {prizePool}
          </div>
        </div>

        {/* Time Left */}
        <div style={{
          padding: '12px',
          background: 'rgba(6, 182, 212, 0.05)',
          border: '1px solid rgba(6, 182, 212, 0.15)',
          borderRadius: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px'
          }}>
            <Clock size={14} color="rgba(255, 255, 255, 0.6)" />
            <span style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 500
            }}>
              TIME
            </span>
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace',
            color: '#06B6D4'
          }}>
            {timeLeft}
          </div>
        </div>

        {/* Entry Fee */}
        <div style={{
          padding: '12px',
          background: 'rgba(168, 85, 247, 0.05)',
          border: '1px solid rgba(168, 85, 247, 0.15)',
          borderRadius: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px'
          }}>
            <Zap size={14} color="rgba(255, 255, 255, 0.6)" />
            <span style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 500
            }}>
              ENTRY
            </span>
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#A855F7'
          }}>
            {arena.betAmount}
          </div>
        </div>
      </div>

      {/* Join Button */}
      <button
        className="btn-premium"
        style={{
          width: '100%',
          background: config.gradient,
          boxShadow: `0 4px 16px ${config.color}40`,
          color: 'white',
          justifyContent: 'center'
        }}
      >
        <Award size={18} />
        View Arena
      </button>
    </div>
  )
}

export function UltraPremiumArenaGrid({ arenas, onArenaClick }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '32px'
    }}>
      {arenas.map((arena, idx) => (
        <div
          key={arena.id}
          style={{
            animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
          }}
        >
          <UltraPremiumArenaCard 
            arena={arena}
            onClick={() => onArenaClick(arena)}
          />
        </div>
      ))}
    </div>
  )
}
