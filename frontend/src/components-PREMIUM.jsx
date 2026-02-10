// ═══════════════════════════════════════════════════════════════
// ULTRA-PREMIUM COMPONENTS
// Luxury gaming aesthetic with advanced animations
// ═══════════════════════════════════════════════════════════════

import { TrendingUp, Users, Clock, Trophy, Zap, Brain, Shield, Target, Sparkles, Star, Crown } from 'lucide-react'
import { useEffect, useState } from 'react'

// ═══════════════════════════════════════════════════════════════
// PREMIUM HERO SECTION
// ═══════════════════════════════════════════════════════════════

export function UltraPremiumHero({ onGetStarted }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div style={{
      position: 'relative',
      padding: '120px 24px 80px',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, rgba(15, 15, 35, 0) 0%, rgba(26, 26, 46, 0.5) 100%)'
    }}>
      {/* Floating Particles */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)
        `,
        animation: 'float 20s ease-in-out infinite'
      }} />

      {/* Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 20px',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(6, 182, 212, 0.1))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          borderRadius: '9999px',
          marginBottom: '32px',
          animation: mounted ? 'fadeInUp 0.6s ease-out' : 'none',
          boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)'
        }}>
          <Crown size={16} color="#F59E0B" />
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.05em'
          }}>
            MOLTIVERSE HACKATHON 2026
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '24px',
          letterSpacing: '-0.03em',
          animation: mounted ? 'fadeInUp 0.8s ease-out 0.2s both' : 'none'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s ease-in-out infinite'
          }}>
            Arena Agent
          </span>
          <br />
          <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            AI-Powered Gaming
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '700px',
          margin: '0 auto 48px',
          lineHeight: 1.6,
          animation: mounted ? 'fadeInUp 1s ease-out 0.4s both' : 'none'
        }}>
          Autonomous AI agent creating competitive gaming arenas with{' '}
          <span style={{
            background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600
          }}>
            automated wagering
          </span>{' '}
          on Monad blockchain
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: mounted ? 'fadeInUp 1.2s ease-out 0.6s both' : 'none'
        }}>
          <button 
            onClick={onGetStarted}
            className="btn-primary-premium"
            style={{
              padding: '18px 40px',
              fontSize: '1.125rem',
              position: 'relative'
            }}
          >
            <Zap size={20} />
            Explore Arenas
          </button>

          <a
            href="https://moltiverse.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glass-premium"
            style={{
              padding: '18px 40px',
              fontSize: '1.125rem',
              textDecoration: 'none'
            }}
          >
            <Trophy size={20} />
            Hackathon Info
          </a>
        </div>

        {/* Stats Preview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '24px',
          maxWidth: '800px',
          margin: '80px auto 0',
          animation: mounted ? 'fadeInUp 1.4s ease-out 0.8s both' : 'none'
        }}>
          {[
            { label: 'Prize Pool', value: '$200K', icon: Trophy },
            { label: 'Game Types', value: '4', icon: Target },
            { label: 'AI Powered', value: '100%', icon: Brain }
          ].map((stat, idx) => (
            <div key={idx} style={{
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '16px',
              transition: 'all 0.3s ease'
            }}>
              <stat.icon size={24} color="#06B6D4" style={{ marginBottom: '8px' }} />
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '4px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 500
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PREMIUM STATS DASHBOARD
// ═══════════════════════════════════════════════════════════════

export function UltraPremiumStats({ stats }) {
  const statItems = [
    {
      label: 'Total Arenas',
      value: stats.total,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)',
      color: '#7C3AED'
    },
    {
      label: 'Active Now',
      value: stats.active,
      icon: Zap,
      gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
      color: '#06B6D4'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      gradient: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
      color: '#F59E0B'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: Trophy,
      gradient: 'linear-gradient(135deg, #A855F7, #7C3AED)',
      color: '#A855F7'
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '80px'
    }}>
      {statItems.map((stat, idx) => (
        <div 
          key={idx}
          className="stat-card-premium"
          style={{
            animationDelay: `${idx * 0.1}s`,
            animation: 'fadeInUp 0.6s ease-out both'
          }}
        >
          {/* Icon */}
          <div className="stat-icon-premium" style={{
            background: stat.gradient,
            boxShadow: `0 8px 32px ${stat.color}40`
          }}>
            <stat.icon size={28} color="white" />
          </div>

          {/* Value */}
          <div className="stat-value-premium">
            {stat.value}
          </div>

          {/* Label */}
          <div className="stat-label-premium">
            {stat.label}
          </div>

          {/* Progress Bar */}
          <div style={{
            marginTop: '16px',
            height: '3px',
            background: 'rgba(124, 58, 237, 0.1)',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min((stat.value / 10) * 100, 100)}%`,
              background: stat.gradient,
              borderRadius: '9999px',
              transition: 'width 1s ease-out 0.5s'
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PREMIUM GAME MODES SHOWCASE
// ═══════════════════════════════════════════════════════════════

export function UltraPremiumGameModes() {
  const gameModes = [
    {
      title: 'Prediction Markets',
      description: 'AI generates market scenarios. Vote on outcomes. Most accurate predictions win the prize pool.',
      icon: '🔮',
      gradient: 'linear-gradient(135deg, #7C3AED, #A855F7)',
      features: ['AI Scenarios', 'Real-time Odds', 'Smart Payouts']
    },
    {
      title: 'Trivia Showdown',
      description: 'Answer AI-generated questions on crypto, tech, and blockchain. Highest score takes all.',
      icon: '📖',
      gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
      features: ['AI Questions', 'Time Pressure', 'Knowledge Test']
    },
    {
      title: 'Trading Arena',
      description: 'Simulated markets with real-time price action. Best portfolio returns win the competition.',
      icon: '📈',
      gradient: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
      features: ['Live Markets', 'Risk Management', 'Portfolio Battle']
    },
    {
      title: 'Strategy Duel',
      description: 'Card-based tactical battles. Outsmart opponents with strategic moves and combos.',
      icon: '⚔️',
      gradient: 'linear-gradient(135deg, #A855F7, #7C3AED)',
      features: ['Turn-Based', 'Skill Match', 'Combo System']
    }
  ]

  return (
    <div style={{
      padding: '80px 24px',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            background: 'rgba(124, 58, 237, 0.1)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '9999px',
            marginBottom: '16px'
          }}>
            <Star size={16} color="#F59E0B" />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              GAME MODES
            </span>
          </div>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Four Ways to Win
          </h2>

          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            AI-powered competitive gaming with automated wagering
          </p>
        </div>

        {/* Game Mode Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {gameModes.map((mode, idx) => (
            <div
              key={idx}
              className="card-premium"
              style={{
                animationDelay: `${idx * 0.15}s`,
                animation: 'fadeInUp 0.8s ease-out both',
                cursor: 'pointer'
              }}
            >
              {/* Icon */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: mode.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                marginBottom: '24px',
                boxShadow: `0 12px 40px ${mode.gradient.match(/#[0-9A-F]{6}/i)[0]}40`,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: '-4px',
                  background: mode.gradient,
                  borderRadius: '24px',
                  opacity: 0.3,
                  filter: 'blur(20px)',
                  zIndex: -1
                }} />
                {mode.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '12px',
                color: 'white'
              }}>
                {mode.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '24px'
              }}>
                {mode.description}
              </p>

              {/* Features */}
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {mode.features.map((feature, fidx) => (
                  <span
                    key={fidx}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(124, 58, 237, 0.1)',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PREMIUM AI SECTION
// ═══════════════════════════════════════════════════════════════

export function UltraPremiumAISection() {
  return (
    <div style={{
      padding: '80px 24px',
      position: 'relative',
      background: 'linear-gradient(180deg, transparent 0%, rgba(124, 58, 237, 0.05) 50%, transparent 100%)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="glass-premium" style={{
          padding: '64px',
          borderRadius: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Side - AI Badge */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '160px',
              height: '160px',
              margin: '0 auto',
              borderRadius: '32px',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(124, 58, 237, 0.5)',
              position: 'relative',
              animation: 'float 6s ease-in-out infinite'
            }}>
              <div style={{
                position: 'absolute',
                inset: '-8px',
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                borderRadius: '36px',
                opacity: 0.3,
                filter: 'blur(30px)',
                zIndex: -1
              }} />
              <Brain size={80} color="white" />
            </div>

            <div style={{
              marginTop: '24px',
              padding: '12px 24px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '9999px',
              display: 'inline-block'
            }}>
              <span style={{
                fontSize: '1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                POWERED BY LLAMA 3.3 70B
              </span>
            </div>
          </div>

          {/* Right Side - Description */}
          <div>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '2.5rem',
              fontWeight: 800,
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Autonomous AI Agent
            </h3>

            <p style={{
              fontSize: '1.125rem',
              lineHeight: 1.8,
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '32px'
            }}>
              Our AI agent autonomously generates game scenarios, judges player performance, 
              and manages prize distribution. Built with Llama 3.3 70B for intelligent, 
              fair, and engaging gameplay on the Monad blockchain.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {[
                { label: 'Scenario Generation', icon: Sparkles },
                { label: 'Fair Judging', icon: Shield },
                { label: 'Auto Payouts', icon: Zap },
                { label: 'Real-time Adaptation', icon: Brain }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: 'rgba(124, 58, 237, 0.05)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                    borderRadius: '12px'
                  }}
                >
                  <feature.icon size={20} color="#06B6D4" />
                  <span style={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PREMIUM LOADER
// ═══════════════════════════════════════════════════════════════

export function UltraPremiumLoader({ text = "Loading..." }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      gap: '24px'
    }}>
      {/* Spinner */}
      <div style={{
        width: '60px',
        height: '60px',
        border: '3px solid rgba(124, 58, 237, 0.2)',
        borderTop: '3px solid #7C3AED',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        boxShadow: '0 0 40px rgba(124, 58, 237, 0.3)'
      }} />

      {/* Text */}
      <div style={{
        fontSize: '1.125rem',
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.8)',
        animation: 'pulse 2s ease-in-out infinite'
      }}>
        {text}
      </div>
    </div>
  )
}
