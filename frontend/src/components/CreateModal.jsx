import { useState } from "react"
import { Icons } from "../App"

const TYPES = [
  { value: 0, label: "Crystal  –  Prediction Battle" },
  { value: 1, label: "Book     –  Trivia Showdown" },
  { value: 2, label: "Chart    –  Trading Challenge" },
  { value: 3, label: "Layers   –  Strategy Card Duel" }
]

export default function CreateModal({ onClose, onCreate }) {
  const [title,      setTitle]      = useState("")
  const [gameType,   setGameType]   = useState(0)
  const [betAmount,  setBetAmount]  = useState("0.01")
  const [minPlayers, setMinPlayers] = useState(2)
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [duration,   setDuration]   = useState(300)
  const [busy,       setBusy]       = useState(false)

  async function go() {
    if (!title.trim()) return
    setBusy(true)
    await onCreate({ title: title.trim(), gameType, betAmount, minPlayers, maxPlayers, durationSec: duration })
    setBusy(false)
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><Icons.X /></button>
        <h2>Create Arena</h2>
        <p className="modal-sub">Set up a new AI-powered competitive arena</p>

        <div className="form-row">
          <label>Arena Title</label>
          <input type="text" placeholder="e.g. Crypto Trivia Masters" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        </div>

        <div className="form-row">
          <label>Game Type</label>
          <select value={gameType} onChange={e => setGameType(Number(e.target.value))}>
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="form-cols">
          <div className="form-row">
            <label>Bet (MON)</label>
            <input type="number" step="0.001" min="0.001" value={betAmount} onChange={e => setBetAmount(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Duration (sec)</label>
            <input type="number" min="60" step="60" value={duration} onChange={e => setDuration(Number(e.target.value))} />
          </div>
        </div>

        <div className="form-cols">
          <div className="form-row">
            <label>Min Players</label>
            <input type="number" min="2" value={minPlayers} onChange={e => setMinPlayers(Number(e.target.value))} />
          </div>
          <div className="form-row">
            <label>Max Players</label>
            <input type="number" min={minPlayers} value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={go} disabled={busy || !title.trim()}>
            {busy ? "Creating…" : "Create Arena"}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
