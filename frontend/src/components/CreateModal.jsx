import { useState } from "react"
import { Icons } from "../App"

export default function CreateModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    gameType: "Prediction",
    betAmount: "0.01",
    duration: 300,
    minPlayers: 2,
    maxPlayers: 8
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate(form)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Create Arena</div>
            <div className="modal-subtitle">Set up a new AI-powered competitive arena</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <Icons.X />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Arena Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Crypto Truth Master"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              required
              maxLength={50}
            />
            <div className="form-hint">Make it catchy! (Max 50 characters)</div>
          </div>

          <div className="form-group">
            <label className="form-label">Game Type</label>
            <select
              className="form-select"
              value={form.gameType}
              onChange={(e) => setForm({...form, gameType: e.target.value})}
            >
              <option value="Prediction">🔮 Prediction - Vote on future outcomes</option>
              <option value="Trivia">📖 Trivia - Answer AI-generated questions</option>
              <option value="Trading">📈 Trading - Simulate market decisions</option>
              <option value="Strategy">⚔️ Strategy - Battle with card selection</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Bet Amount (MON)</label>
            <input
              type="number"
              className="form-input"
              placeholder="0.01"
              value={form.betAmount}
              onChange={(e) => setForm({...form, betAmount: e.target.value})}
              step="0.01"
              min="0.01"
              required
            />
            <div className="form-hint">Entry fee per player (testnet MON)</div>
          </div>

          <div className="form-group">
            <label className="form-label">Duration (seconds)</label>
            <input
              type="number"
              className="form-input"
              placeholder="300"
              value={form.duration}
              onChange={(e) => setForm({...form, duration: parseInt(e.target.value)})}
              min="60"
              max="3600"
              required
            />
            <div className="form-hint">Game duration: 60s to 1 hour</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Min Players</label>
              <input
                type="number"
                className="form-input"
                value={form.minPlayers}
                onChange={(e) => setForm({...form, minPlayers: parseInt(e.target.value)})}
                min="2"
                max={form.maxPlayers}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Players</label>
              <input
                type="number"
                className="form-input"
                value={form.maxPlayers}
                onChange={(e) => setForm({...form, maxPlayers: parseInt(e.target.value)})}
                min={form.minPlayers}
                max="20"
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Icons.Plus />
              Create Arena
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
