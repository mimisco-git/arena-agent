// ═══════════════════════════════════════════════════════════════
// ARENA AGENT - PREMIUM COMPONENTS
// ═══════════════════════════════════════════════════════════════

import { Sparkles, Zap, Trophy, Users, Clock, TrendingUp, 
         Brain, Cpu, Activity, Shield, Target, Rocket } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════

export function HeroSection({ onGetStarted }) {
  return (
    <div className="hero">
      <div className="hero-badge" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '9999px',
        background: 'rgba(110, 84, 255, 0.2)',
        border: '1px solid rgba(110, 84, 255, 0.3)',
        marginBottom: '24px',
        animation: 'fadeInUp 0.6s ease-out'
      }}>
        <Sparkles size={16} color="#85E6FF" />
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
          Powered by AI • Built on Monad
        </span>
      </div>

      <h1 className="hero-title gradient-text">
        THE ARENA
      </h1>
      
      <p className="hero-subtitle">
        Autonomous AI gaming agent with on-chain wagering on Monad.
        <br />
        Compete in AI-generated games. Win MON. Dominate the leaderboard.
      </p>

      <div className="hero-cta">
        <button className="btn btn-primary" onClick={onGetStarted}>
          <Rocket size={20} />
          Enter Arena
        </button>
        <button className="btn btn-secondary">
          <Activity size={20} />
          View Live Games
        </button>
      </div>

      {/* Floating stats */}
      <div style={{
        marginTop: '64px',
        display: 'flex',
        gap: '48px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        opacity: 0.8
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6E54FF, #85E6FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>$10K</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
            Prize Pool
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FF8EE4, #6E54FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>4</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
            Game Modes
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #85E6FF, #FF8EE4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>100%</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
            AI-Powered
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PREMIUM STATS DASHBOARD
// ═══════════════════════════════════════════════════════════════

export function StatsDashboard({ stats }) {
  const statItems = [
    { 
      icon: Trophy, 
      label: 'Total Arenas', 
      value: stats.total || 0,
      gradient: 'linear-gradient(135deg, #6E54FF, #85E6FF)'
    },
    { 
      icon: Activity, 
      label: 'Active Now', 
      value: stats.active || 0,
      gradient: 'linear-gradient(135deg, #00FF88, #00D4FF)'
    },
    { 
      icon: Clock, 
      label: 'In Progress', 
      value: stats.inProgress || 0,
      gradient: 'linear-gradient(135deg, #FFAE45, #FF8EE4)'
    },
    { 
      icon: TrendingUp, 
      label: 'Completed', 
      value: stats.completed || 0,
      gradient: 'linear-gradient(135deg, #85E6FF, #6E54FF)'
    }
  ]

  return (
    <div className="stats-grid">
      {statItems.map((stat, idx) => (
        <div key={idx} className="stat-card" style={{
          animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s backwards`
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 16px',
            borderRadius: '12px',
            background: stat.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(110, 84, 255, 0.3)'
          }}>
            <stat.icon size={24} color="white" />
          </div>
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// GAME MODES SHOWCASE
// ═══════════════════════════════════════════════════════════════

export function GameModesShowcase() {
  const gameModes = [
    {
      icon: '🔮',
      name: 'Prediction',
      description: 'AI generates scenarios. Vote on outcomes. Closest predictions win.',
      color: '#6E54FF',
      features: ['Market Predictions', 'Event Forecasting', 'Trend Analysis']
    },
    {
      icon: '📖',
      name: 'Trivia',
      description: 'AI-generated questions on crypto, tech, and more. Test your knowledge.',
      color: '#85E6FF',
      features: ['Dynamic Questions', 'Multiple Difficulty', 'Time Pressure']
    },
    {
      icon: '📈',
      name: 'Trading',
      description: 'Simulated markets. Make buy/sell decisions. Best returns win.',
      color: '#FF8EE4',
      features: ['Live Market Sim', 'Portfolio Management', 'Risk vs Reward']
    },
    {
      icon: '⚔️',
      name: 'Strategy',
      description: 'Battle with card selection. Outsmart opponents with strategic choices.',
      color: '#FFAE45',
      features: ['Card Battles', 'Strategic Depth', 'Counter-play']
    }
  ]

  return (
    <div style={{ padding: '64px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ 
          fontSize: 'clamp(2rem, 5vw, 3rem)', 
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #6E54FF, #85E6FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Four Ways to Win
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
          Each game mode is generated and judged by our autonomous AI agent
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {gameModes.map((mode, idx) => (
          <div key={idx} className="card" style={{
            animation: `fadeInUp 0.6s ease-out ${idx * 0.15}s backwards`,
            borderTop: `2px solid ${mode.color}`
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{mode.icon}</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{mode.name}</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', minHeight: '60px' }}>
              {mode.description}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {mode.features.map((feature, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: mode.color
                  }} />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// AI AGENT SECTION
// ═══════════════════════════════════════════════════════════════

export function AIAgentSection() {
  const features = [
    {
      icon: Brain,
      title: 'Content Generation',
      description: 'Llama 3.3 70B generates unique game scenarios, questions, and challenges'
    },
    {
      icon: Shield,
      title: 'Fair Judging',
      description: 'Autonomous evaluation ensures unbiased winner selection'
    },
    {
      icon: Cpu,
      title: 'Smart Contracts',
      description: 'On-chain execution on Monad for trustless wagering and payouts'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Instant game generation and rapid result determination'
    }
  ]

  return (
    <div style={{ 
      padding: '80px 24px',
      background: 'linear-gradient(180deg, rgba(26, 15, 58, 0.4) 0%, rgba(10, 1, 24, 0.2) 100%)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(133, 230, 255, 0.1)',
            border: '1px solid rgba(133, 230, 255, 0.2)',
            marginBottom: '24px'
          }}>
            <Cpu size={16} color="#85E6FF" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#85E6FF' }}>
              POWERED BY AI
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #85E6FF, #FF8EE4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Meet the Arena Agent
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'rgba(255,255,255,0.7)', 
            maxWidth: '700px', 
            margin: '0 auto' 
          }}>
            Our autonomous AI handles everything from content creation to winner determination.
            Zero human intervention. Pure algorithmic fairness.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {features.map((feature, idx) => (
            <div key={idx} className="glass" style={{
              padding: '32px',
              borderRadius: '16px',
              animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s backwards`
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6E54FF, #85E6FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 8px 24px rgba(110, 84, 255, 0.4)'
              }}>
                <feature.icon size={28} color="white" />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>{feature.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div style={{
          marginTop: '64px',
          padding: '40px',
          background: 'rgba(110, 84, 255, 0.05)',
          border: '1px solid rgba(110, 84, 255, 0.2)',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Tech Stack</h3>
          <div style={{
            display: 'flex',
            gap: '32px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.95rem'
          }}>
            <div style={{ opacity: 0.9 }}>
              <div style={{ color: '#85E6FF', marginBottom: '8px' }}>Model</div>
              <div>Llama 3.3 70B</div>
            </div>
            <div style={{ opacity: 0.9 }}>
              <div style={{ color: '#85E6FF', marginBottom: '8px' }}>Blockchain</div>
              <div>Monad Testnet</div>
            </div>
            <div style={{ opacity: 0.9 }}>
              <div style={{ color: '#85E6FF', marginBottom: '8px' }}>API</div>
              <div>Groq</div>
            </div>
            <div style={{ opacity: 0.9 }}>
              <div style={{ color: '#85E6FF', marginBottom: '8px' }}>Frontend</div>
              <div>React + Vite</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PREMIUM LOADING STATE
// ═══════════════════════════════════════════════════════════════

export function PremiumLoader({ text = "Loading arenas..." }) {
  return (
    <div className="loader-premium">
      <div style={{
        width: '80px',
        height: '80px',
        position: 'relative'
      }}>
        <div className="spinner" />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '2rem'
        }}>
          ⚡
        </div>
      </div>
      <div style={{
        fontSize: '1.1rem',
        color: 'rgba(255,255,255,0.8)',
        fontWeight: 500
      }}>
        {text}
      </div>
      <div style={{
        display: 'flex',
        gap: '8px'
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6E54FF, #85E6FF)',
            animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
      </div>
    </div>
  )
}

