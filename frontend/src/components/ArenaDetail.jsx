import { useState } from "react"
import { GAME_CONFIG, Icons } from "../App"

export default function ArenaDetail({ arena, wallet, onBack, onJoin, onStart, onSubmit, onSettle }) {
  const [selOption, setSelOption]   = useState(null)
  const [round, setRound]           = useState(0)
  const [submitted, setSubmitted]   = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const cfg      = GAME_CONFIG[arena.gameType] || GAME_CONFIG[0]
  const isPlayer = wallet && arena.players.some(p => p.address === wallet)
  const isFull   = arena.players.length >= arena.maxPlayers
  const prize    = (parseFloat(arena.betAmount) * arena.players.length * 0.98).toFixed(4)

  // ── submit handler ──
  async function handleSubmit() {
    if (selOption === null) return
    setSubmitted(true)
    const res = await onSubmit(arena.id, selOption, round)
    setLastResult(res)
  }
  function nextRound() { setRound(r => r + 1); setSelOption(null); setSubmitted(false); setLastResult(null) }

  // ── game panels ──
  function renderGame() {
    const g = arena.gameData
    if (!g) return <p style={{ color: "var(--text-sub)", fontSize: 14 }}>Game not started yet</p>

    switch (arena.gameType) {
      /* ── PREDICTION ── */
      case 0: return (
        <div className="game-panel">
          <h4><span style={{ display:"inline-flex", width:18, height:18, color:"var(--cyan)" }}><Icons.Crystal /></span> Prediction Scenario</h4>
          <div className="question-box">
            <p className="q-text">{g.scenario?.scenario}</p>
            <p style={{ color: "var(--text-sub)", marginBottom: 14 }}>{g.scenario?.question}</p>
            <div className="options">
              {(g.scenario?.options || ["Yes","No"]).map((opt, i) => (
                <button key={i} className={`option-btn ${selOption === opt ? "selected" : ""}`}
                  onClick={() => !submitted && setSelOption(opt)} disabled={submitted}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {!submitted && isPlayer && (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={selOption === null}>Lock In Prediction</button>
          )}
          {submitted && <p className="feedback-correct">Prediction locked in</p>}
        </div>
      )

      /* ── TRIVIA ── */
      case 1: {
        const q = g.questions?.[round]
        const allDone = round >= (g.questions?.length || 0)
        return (
          <div className="game-panel">
            <h4><span style={{ display:"inline-flex", width:18, height:18, color:"var(--purple-light)" }}><Icons.BookOpen /></span> Trivia Showdown</h4>
            {allDone ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <p style={{ color: "var(--gold)", fontWeight: 700, fontSize: 18 }}>All rounds complete</p>
                {g.scores?.[wallet] !== undefined && <p style={{ color: "var(--text-sub)", marginTop: 6 }}>Your score: <strong style={{ color: "var(--text)" }}>{g.scores[wallet]}</strong></p>}
              </div>
            ) : q ? (
              <>
                <div className="round-indicator">Round {round + 1} of {g.questions?.length}</div>
                <div className="question-box">
                  <p className="q-text">{q.question}</p>
                  <div className="options">
                    {q.options.map((opt, i) => (
                      <button key={i} className={`option-btn ${selOption === i ? "selected" : ""}`}
                        onClick={() => !submitted && setSelOption(i)} disabled={submitted}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                {!submitted && isPlayer && (
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={selOption === null}>Answer</button>
                )}
                {submitted && (
                  <div>
                    <p className={lastResult?.correct ? "feedback-correct" : "feedback-wrong"}>
                      {lastResult?.correct ? "Correct!" : "Wrong"} — {lastResult?.score || 0} pts
                    </p>
                    <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={nextRound}>Next Round →</button>
                  </div>
                )}
              </>
            ) : <p style={{ color: "var(--text-sub)" }}>Loading questions…</p>}
          </div>
        )
      }

      /* ── TRADING ── */
      case 2: {
        const portfolio = g.portfolios?.[wallet]
        return (
          <div className="game-panel">
            <h4><span style={{ display:"inline-flex", width:18, height:18, color:"var(--green)" }}><Icons.TrendingUp /></span> Trading Challenge</h4>
            {portfolio ? (
              <>
                <div className="portfolio-grid">
                  <div className="portfolio-card">
                    <div className="p-label">Cash</div>
                    <div className="p-value" style={{ color: "var(--green)" }}>${portfolio.cash.toFixed(2)}</div>
                  </div>
                  {Object.entries(portfolio.holdings).map(([asset, qty]) => (
                    <div key={asset} className="portfolio-card">
                      <div className="p-label">{asset}</div>
                      <div className="p-value" style={{ color: "var(--text)" }}>{qty.toFixed(2)}</div>
                      <div className="p-sub">${(g.currentPrices?.[asset] || 0).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <p style={{ color: "var(--text-sub)", fontSize: 13 }}>Live prices update every tick. Trading UI coming in next sprint.</p>
              </>
            ) : <p style={{ color: "var(--text-sub)" }}>Join to see your portfolio</p>}
          </div>
        )
      }

      /* ── STRATEGY ── */
      case 3: {
        const deck = g.decks?.[wallet]
        return (
          <div className="game-panel">
            <h4><span style={{ display:"inline-flex", width:18, height:18, color:"var(--gold)" }}><Icons.Layers /></span> Strategy Card Duel</h4>
            {g.rules && <p style={{ color: "var(--text-sub)", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>{g.rules}</p>}
            {deck ? (
              <>
                <div className="card-duel-grid">
                  {deck.map((card, i) => {
                    const played = g.played?.[wallet]?.some(p => p.cardIndex === i)
                    return (
                      <div key={i}
                        className={`duel-card ${played ? "played" : ""} ${selOption === i ? "selected" : ""}`}
                        onClick={() => !played && !submitted && setSelOption(i)}>
                        <div className="card-name">{card.name}</div>
                        <div className="card-stats">
                          <span className="stat-atk">ATK {card.attack}</span>
                          <span className="stat-def">DEF {card.defense}</span>
                        </div>
                        <div className="card-flavor">{card.flavor}</div>
                        {played && <div className="played-tag">Played</div>}
                      </div>
                    )
                  })}
                </div>
                {!submitted && isPlayer && selOption !== null && (
                  <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleSubmit}>Play Card</button>
                )}
                {submitted && lastResult && (
                  <div style={{ marginTop: 14 }}>
                    <p className="feedback-correct">Played <strong>{lastResult.card?.name}</strong> (ATK {lastResult.card?.attack})</p>
                    <button className="btn btn-secondary" style={{ marginTop: 8 }}
                      onClick={() => { setSubmitted(false); setSelOption(null); setLastResult(null) }}>
                      Play Another
                    </button>
                  </div>
                )}
              </>
            ) : <p style={{ color: "var(--text-sub)" }}>Join to see your cards</p>}
          </div>
        )
      }

      default: return null
    }
  }

  return (
    <div>
      {/* Back btn */}
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: 18 }}>
        <span style={{ display:"inline-flex", width:16, height:16 }}><Icons.ChevronLeft /></span> Back
      </button>

      {/* Header block */}
      <div className="detail-header">
        <div className="detail-header-left">
          <div className="detail-type">{cfg.label}</div>
          <h1>{arena.title}</h1>
          <span className={`badge ${arena.status}`}>
            <span className="badge-dot" />
            {arena.status === "in_progress" ? "Live" : arena.status === "completed" ? "Completed" : "Open"}
          </span>
        </div>
        <div className="detail-actions">
          {arena.status === "open" && !isPlayer && !isFull && (
            <button className="btn btn-primary" onClick={() => onJoin(arena.id)}>
              Join Arena — {arena.betAmount} MON
            </button>
          )}
          {arena.status === "open" && arena.players.length >= arena.minPlayers && (
            <button className="btn btn-success" onClick={() => onStart(arena.id)}>Start Game</button>
          )}
          {arena.status === "in_progress" && (
            <button className="btn btn-secondary" onClick={() => onSettle(arena.id)}>Settle (AI Judge)</button>
          )}
          {isFull && arena.status === "open" && (
            <span style={{ color: "var(--red)", fontSize: 14, alignSelf: "center" }}>Full</span>
          )}
        </div>
      </div>

      {/* Info row */}
      <div className="detail-info-row">
        <div className="detail-info-item">
          <span style={{ display:"inline-flex", width:16, height:16 }}><Icons.Users /></span>
          <span className="info-val">{arena.players.length}</span> / {arena.maxPlayers} players
        </div>
        <div className="detail-info-item">
          <span style={{ display:"inline-flex", width:16, height:16 }}><Icons.Diamond /></span>
          <span className="info-val">{arena.betAmount}</span> MON entry
        </div>
        <div className="detail-info-item">
          <span style={{ display:"inline-flex", width:16, height:16 }}><Icons.Trophy /></span>
          Prize: <span className="info-val" style={{ color: "var(--gold)" }}>{prize} MON</span>
        </div>
      </div>

      {/* Players */}
      <div className="players-section">
        <h4>Players</h4>
        <div>
          {arena.players.length === 0
            ? <span style={{ color: "var(--text-muted)", fontSize: 13 }}>No players yet</span>
            : arena.players.map((p, i) => {
                const isYou = p.address === wallet
                return (
                  <span key={i} className={`player-chip ${isYou ? "is-you" : ""}`}>
                    {isYou && <span className="you-badge">YOU</span>}
                    {p.address.slice(0,6)}…{p.address.slice(-4)}
                  </span>
                )
              })
          }
        </div>
      </div>

      {/* Winners */}
      {arena.winners?.length > 0 && (
        <div className="winners-box">
          <h4><span style={{ display:"inline-flex", width:18, height:18 }}><Icons.Trophy /></span> Winners</h4>
          <div>
            {arena.winners.map((w, i) => (
              <span key={i} className={`player-chip ${w === wallet ? "is-you" : ""}`} style={{ borderColor: "rgba(52,211,153,.3)" }}>
                {w === wallet && <span className="you-badge" style={{ background:"rgba(52,211,153,.2)", color:"var(--green)" }}>YOU</span>}
                {w.slice(0,6)}…{w.slice(-4)}
              </span>
            ))}
          </div>
          <p>Each winner receives <strong style={{ color: "var(--green)" }}>{(parseFloat(arena.betAmount) * arena.players.length * 0.98 / arena.winners.length).toFixed(4)} MON</strong></p>
        </div>
      )}

      {/* Game Panel */}
      {arena.status === "in_progress" && isPlayer && renderGame()}

      {/* Event Log */}
      {arena.log?.length > 0 && (
        <div className="event-log">
          <h4>Event Log</h4>
          <div className="log-box">
            {arena.log.slice().reverse().map((e, i) => (
              <div key={i} className="log-entry">
                <span className="log-time">{new Date(e.t).toLocaleTimeString()}</span>
                <span>{e.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
