// ═══════════════════════════════════════════════════════════════
// MONAD TESTNET FAUCET MODAL
// Help users get MON tokens for wagering
// ═══════════════════════════════════════════════════════════════

import { X, Droplet, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function FaucetModal({ onClose }) {
  const [copied, setCopied] = useState(false)

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const faucets = [
    {
      name: "Official Monad Faucet",
      url: "https://faucet.monad.xyz/",
      amount: "Varies",
      cooldown: "6 hours",
      requirement: "10 MON on mainnet OR 0.001 ETH",
      recommended: true
    },
    {
      name: "QuickNode Faucet",
      url: "https://faucet.quicknode.com/monad",
      amount: "1 MON",
      cooldown: "12 hours",
      requirement: "Tweet about faucet",
      recommended: true
    },
    {
      name: "Chainstack Faucet",
      url: "https://chainstack.com/how-to-get-monad-testnet-tokens/",
      amount: "0.5 MON",
      cooldown: "24 hours",
      requirement: "API key (free)",
      recommended: false
    }
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      
      <div className="glass" style={{
        maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
        borderRadius: '24px', border: '2px solid var(--monad-cyan)',
        position: 'relative', animation: 'slideUp 0.3s ease-out'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(133, 230, 255, 0.2), rgba(133, 230, 255, 0.1))',
          borderBottom: '1px solid rgba(133, 230, 255, 0.3)',
          padding: '32px', position: 'relative'
        }}>
          <button onClick={onClose} className="btn btn-ghost btn-icon"
            style={{ position: 'absolute', top: '16px', right: '16px' }}>
            <X size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #85E6FF, #6E54FF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', boxShadow: '0 8px 24px rgba(133, 230, 255, 0.4)'
            }}>
              <Droplet size={32} color="white" />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.8rem', fontWeight: 700, margin: 0,
                fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)'
              }}>
                Get MON Tokens
              </h2>
              <p style={{ margin: 0, color: 'var(--text-tertiary)' }}>
                Free testnet tokens for Arena Agent
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          margin: '24px 32px',
          padding: '20px',
          background: 'rgba(133, 230, 255, 0.1)',
          border: '1px solid rgba(133, 230, 255, 0.3)',
          borderRadius: '12px'
        }}>
          <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
            💡 Why do I need MON tokens?
          </div>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            MON is used to pay gas fees and place bets in arenas on Monad testnet. These are free testnet tokens with no real value - perfect for testing Arena Agent!
          </div>
        </div>

        {/* Faucet List */}
        <div style={{ padding: '0 32px 32px' }}>
          <h3 style={{
            fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px',
            color: 'var(--text-primary)'
          }}>
            Available Faucets
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faucets.map((faucet, idx) => (
              <div key={idx} className="glass" style={{
                padding: '20px',
                borderRadius: '12px',
                border: faucet.recommended 
                  ? '1px solid rgba(133, 230, 255, 0.4)' 
                  : '1px solid var(--glass-border)',
                position: 'relative'
              }}>
                {faucet.recommended && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '16px',
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #85E6FF, #6E54FF)',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'white'
                  }}>
                    ⭐ RECOMMENDED
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {faucet.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {faucet.requirement}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '12px',
                  marginBottom: '16px',
                  padding: '12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Amount
                    </div>
                    <div style={{ fontWeight: 600, color: '#85E6FF' }}>
                      {faucet.amount}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Cooldown
                    </div>
                    <div style={{ fontWeight: 600, color: '#FFAE45' }}>
                      {faucet.cooldown}
                    </div>
                  </div>
                </div>

                <a 
                  href={faucet.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #85E6FF, #6E54FF)'
                  }}
                >
                  <ExternalLink size={18} />
                  Get Tokens
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Network Info */}
        <div style={{
          padding: '24px 32px',
          borderTop: '1px solid var(--glass-border)',
          background: 'var(--bg-tertiary)'
        }}>
          <div style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            📡 Monad Testnet Info
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Network Name:</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>
                Monad Testnet
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Chain ID:</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>
                  10143
                </span>
                <button 
                  onClick={() => copyAddress('10143')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: copied ? '#00FF88' : 'var(--text-muted)'
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Explorer:</span>
              <a 
                href="https://testnet.monadexplorer.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#85E6FF', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.85rem'
                }}
              >
                testnet.monadexplorer.com
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
