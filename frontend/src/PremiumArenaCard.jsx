// ═══════════════════════════════════════════════════════════════
// PREMIUM ARENA CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

import { Users, Clock, Trophy, Zap, Target, Swords } from 'lucide-react'

const gameTypeConfig = [
  { 
    label: "Prediction", 
    icon: "🔮", 
    color: "#6E54FF",
    Icon: Target,
    description: "AI-generated market scenarios"
  },
  { 
    label: "Trivia", 
    icon: "📖", 
    color: "#85E6FF",
    Icon: Zap,
    description: "Knowledge-based challenges"
  },
  { 
    label: "Trading", 
    icon: "📈", 
    color: "#FF8EE4",
    Icon: Trophy,
    description: "Simulated market trading"
  },
  { 
    label: "Strategy", 
    icon: "⚔️", 
    color: "#FFAE45",
    Icon: Swords,
    description: "Card-based battles"
  }
]

export function PremiumArenaCard({ arena, onClick }) {
  const config = gameTypeConfig[arena.gameType] || gameTypeConfig[0]
  
  // Calculate time remaining
  const now = Math.floor(Date.now() / 1000)
  const timeRemaining = arena.endTime - now
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  
  // Status
  const isOpen = arena.status === 'open'
  const isInProgress = arena.status === 'in-progress'
  const isCompleted = arena.status === 'completed'
  
  return (
    <div 
      className="arena-card" 
      onClick={() => onClick(arena)}
      style={{
        borderLeft: `3px solid ${config.color}`
      }}
    >
      {/* Header */}
      <div className="arena-header">
        <div className="arena-icon" style={{
          background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`
        }}>
          <span style={{ fontSize: '24px' }}>{config.icon}</span>
        </div>
        
        <div className={`arena-status status-${arena.status}`}>
          <div className="status-dot" />
          {isOpen ? 'OPEN' : isInProgress ? 'LIVE' : 'ENDED'}
        </div>
      </div>

      {/* Title */}
      <h3 className="arena-title">{arena.title}</h3>
      
      {/* Type Badge */}
      <div className="arena-type" style={{
        background: `${config.color}22`,
        borderColor: `${config.color}44`,
        color: config.color
      }}>
        <config.Icon size={14} />
        {config.label}
      </div>

      {/* Stats Grid */}
      <div className="arena-stats">
        <div className="arena-stat">
          <span className="arena-stat-value" style={{ color: config.color }}>
            {arena.players?.length || 0}/{arena.maxPlayers}
          </span>
          <span className="arena-stat-label">
            <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Players
          </span>
        </div>
        
        <div className="arena-stat">
          <span className="arena-stat-value" style={{ color: '#FFAE45' }}>
            {arena.betAmount}
          </span>
          <span className="arena-stat-label">
            <Trophy size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Bet MON
          </span>
        </div>
        
        <div className="arena-stat">
          <span className="arena-stat-value" style={{ color: '#85E6FF' }}>
            {timeRemaining > 0 ? `${minutes}m` : 'Ended'}
          </span>
          <span className="arena-stat-label">
            <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Time
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="arena-footer">
        <div className="arena-timer" style={{ 
          color: timeRemaining < 300 ? '#FF8EE4' : 'rgba(255,255,255,0.7)'
        }}>
          {timeRemaining > 0 ? (
            <>
              <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {minutes}:{seconds.toString().padStart(2, '0')}
            </>
          ) : (
            'Awaiting Results'
          )}
        </div>
        
        <button 
          className="btn btn-primary"
          style={{ 
            padding: '8px 20px',
            fontSize: '0.9rem',
            background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`
          }}
          onClick={(e) => {
            e.stopPropagation()
            onClick(arena)
          }}
        >
          {isOpen ? 'Join Arena' : 'View Details'}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ARENA GRID
// ═══════════════════════════════════════════════════════════════

export function ArenaGrid({ arenas, onArenaClick }) {
  if (!arenas || arenas.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '64px 24px',
        color: 'rgba(255,255,255,0.6)'
      }}>
        <Trophy size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
        <div style={{ fontSize: '1.2rem' }}>No arenas available</div>
        <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
          Check back soon for new challenges!
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
      gap: '24px',
      padding: '24px'
    }}>
      {arenas.map((arena, idx) => (
        <div key={arena.id} style={{
          animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s backwards`
        }}>
          <PremiumArenaCard arena={arena} onClick={onArenaClick} />
        </div>
      ))}
    </div>
  )
}
