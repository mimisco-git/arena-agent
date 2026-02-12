// ═══════════════════════════════════════════════════════════════
// REAL-TIME GAME PLAY COMPONENT
// Handles live gameplay for all 4 game types
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { X, Clock, Trophy, TrendingUp, Zap } from 'lucide-react'

const BACKEND = "https://arena-agent-backend.onrender.com/api"

export function GamePlayModal({ arena, playerAddress, onClose, onComplete }) {
  const [gameData, setGameData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [toast, setToast] = useState(null)

  // Load game when modal opens
  useEffect(() => {
    loadGame()
  }, [arena.id])

  // Countdown timer
  useEffect(() => {
    if (!gameData) return
    
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000)
      const remaining = arena.endTime - now
      setTimeLeft(Math.max(0, remaining))
      
      if (remaining <= 0) {
        showToast('Time is up! Judging results...', 'info')
        setTimeout(() => completeGame(), 2000)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [gameData, arena.endTime])

  async function loadGame() {
    try {
      const res = await fetch(`${BACKEND}/arenas/${arena.id}/game?playerAddress=${playerAddress}`)
      const data = await res.json()
      
      if (data.error) {
        showToast(data.error, 'error')
        setTimeout(onClose, 2000)
        return
      }

      setGameData(data)
      setTimeLeft(data.timeRemaining || 0)
      setLoading(false)
    } catch (error) {
      console.error('Load game error:', error)
      showToast('Failed to load game', 'error')
      setTimeout(onClose, 2000)
    }
  }

  async function submitAnswer() {
    if (!selectedAnswer && selectedAnswer !== 0) {
      showToast('Please select an answer!', 'warning')
      return
    }

    try {
      const res = await fetch(`${BACKEND}/arenas/${arena.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerAddress,
          answer: selectedAnswer
        })
      })

      const data = await res.json()
      
      if (data.success) {
        setSubmitted(true)
        showToast('Answer submitted! ✅', 'success')
        
        // Auto-complete after submission
        setTimeout(() => completeGame(), 3000)
      } else {
        showToast(data.error || 'Submission failed', 'error')
      }
    } catch (error) {
      console.error('Submit error:', error)
      showToast('Failed to submit answer', 'error')
    }
  }

  async function completeGame() {
    try {
      const res = await fetch(`${BACKEND}/arenas/${arena.id}/complete`, {
        method: 'POST'
      })
      
      const data = await res.json()
      
      if (data.success) {
        showToast('Game completed! Check results...', 'success')
        setTimeout(() => onComplete(data), 2000)
      }
    } catch (error) {
      console.error('Complete game error:', error)
    }
  }

  function showToast(message, type = 'info') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          padding: '60px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.1))',
          backdropFilter: 'blur(24px)', borderRadius: '24px',
          border: '1px solid rgba(124, 58, 237, 0.3)'
        }}>
          <div style={{
            width: '60px', height: '60px', border: '3px solid rgba(124, 58, 237, 0.2)',
            borderTop: '3px solid #7C3AED', borderRadius: '50%', margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>
            Loading game...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
      backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      animation: 'fadeIn 0.3s ease-out'
    }} onClick={onClose}>
      
      <div className="glass-premium" style={{
        maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
        borderRadius: '32px', border: '2px solid rgba(124, 58, 237, 0.4)',
        animation: 'slideUp 0.4s ease-out'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(6, 182, 212, 0.2))',
          borderBottom: '1px solid rgba(124, 58, 237, 0.3)',
          padding: '32px', position: 'relative'
        }}>
          <button onClick={onClose} className="btn-glass-premium" style={{
            position: 'absolute', top: '24px', right: '24px',
            width: '44px', height: '44px', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <X size={24} />
          </button>

          <h2 style={{
            fontSize: '2rem', fontWeight: 800, marginBottom: '16px',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            {arena.title}
          </h2>

          {/* Timer */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 20px', background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '12px',
            display: 'inline-flex'
          }}>
            <Clock size={20} color="#06B6D4" />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.25rem', fontWeight: 700, color: '#06B6D4' }}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Game Content */}
        <div style={{ padding: '40px' }}>
          {/* Prediction/Trivia Game */}
          {(arena.gameType === 0 || arena.gameType === 1) && (
            <>
              {gameData.gameData.scenario && (
                <div style={{
                  padding: '20px', background: 'rgba(124, 58, 237, 0.1)',
                  border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '16px',
                  marginBottom: '32px'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Scenario
                  </div>
                  <div style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>
                    {gameData.gameData.scenario}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'white' }}>
                  {gameData.gameData.question}
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                  {gameData.gameData.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => !submitted && setSelectedAnswer(idx)}
                      disabled={submitted}
                      style={{
                        padding: '20px', textAlign: 'left',
                        background: selectedAnswer === idx 
                          ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(6, 182, 212, 0.2))'
                          : 'rgba(255,255,255,0.05)',
                        border: selectedAnswer === idx
                          ? '2px solid rgba(124, 58, 237, 0.6)'
                          : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px', cursor: submitted ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease', fontSize: '1.05rem',
                        color: 'white', fontWeight: 500,
                        opacity: submitted ? 0.6 : 1
                      }}
                    >
                      <span style={{
                        display: 'inline-block', width: '32px', height: '32px',
                        borderRadius: '8px', background: selectedAnswer === idx
                          ? 'linear-gradient(135deg, #7C3AED, #06B6D4)'
                          : 'rgba(255,255,255,0.1)',
                        marginRight: '16px', textAlign: 'center', lineHeight: '32px',
                        fontWeight: 700
                      }}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Trading Game */}
          {arena.gameType === 2 && (
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px', color: 'white' }}>
                🚧 Trading Arena - Coming Soon!
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                Live market simulation with real-time price updates will be available soon.
              </p>
            </div>
          )}

          {/* Strategy Game */}
          {arena.gameType === 3 && (
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px', color: 'white' }}>
                ⚔️ Strategy Duel - Coming Soon!
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                Card-based tactical battles will be available soon.
              </p>
            </div>
          )}

          {/* Submit Button */}
          {!submitted && (arena.gameType === 0 || arena.gameType === 1) && (
            <button
              onClick={submitAnswer}
              className="btn-premium"
              style={{
                width: '100%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.5)',
                justifyContent: 'center', fontSize: '1.125rem', padding: '18px'
              }}
            >
              <Zap size={20} />
              Submit Answer
            </button>
          )}

          {submitted && (
            <div style={{
              padding: '24px', background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '16px',
              textAlign: 'center'
            }}>
              <Trophy size={32} color="#22C55E" style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#22C55E', marginBottom: '8px' }}>
                Answer Submitted!
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>
                Waiting for AI to judge results...
              </div>
            </div>
          )}
        </div>
      </div>

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
          fontWeight: 600, zIndex: 1001, animation: 'fadeInUp 0.4s ease-out',
          fontSize: '1.05rem', border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

// Results Modal
export function GameResultsModal({ arena, results, onClose }) {
  if (!results) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
      backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px'
    }} onClick={onClose}>
      
      <div className="glass-premium" style={{
        maxWidth: '700px', width: '100%', borderRadius: '32px',
        border: '2px solid rgba(124, 58, 237, 0.4)'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(124, 58, 237, 0.2))',
          padding: '40px', borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
          textAlign: 'center'
        }}>
          <Trophy size={64} color="#F59E0B" style={{ marginBottom: '16px' }} />
          <h2 style={{
            fontSize: '2rem', fontWeight: 800, marginBottom: '8px',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Game Complete!
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)' }}>
            {results.winners?.length} Winner{results.winners?.length !== 1 ? 's' : ''}!
          </p>
        </div>

        <div style={{ padding: '40px' }}>
          {/* Winners */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: '#F59E0B' }}>
              🏆 Winners
            </div>
            {results.winners?.map((winner, idx) => (
              <div key={idx} style={{
                padding: '16px', background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px',
                marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.95rem', color: 'white'
              }}>
                {winner.slice(0, 6)}...{winner.slice(-4)}
              </div>
            ))}
          </div>

          {/* Correct Answer */}
          {results.gameData?.correctAnswer !== undefined && (
            <div style={{
              padding: '20px', background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Correct Answer
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#06B6D4', marginBottom: '12px' }}>
                {String.fromCharCode(65 + results.gameData.correctAnswer)}
              </div>
              {results.gameData.explanation && (
                <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                  {results.gameData.explanation}
                </div>
              )}
            </div>
          )}

          <button onClick={onClose} className="btn-primary-premium" style={{
            width: '100%', justifyContent: 'center', padding: '16px'
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
