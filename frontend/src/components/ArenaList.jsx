import { GAME_CONFIG, Icons } from "../App"

export default function ArenaList({ arenas, onSelect }) {
  if (!arenas.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><Icons.Stadium /></div>
        <p>No arenas yet — create one to get started</p>
      </div>
    )
  }

  return (
    <div className="arena-grid">
      {arenas.map(a => {
        const cfg = GAME_CONFIG[a.gameType] || GAME_CONFIG[0]
        const Icon = cfg.Icon
        return (
          <div className="arena-card" key={a.id} onClick={() => onSelect(a)}>
            <div className="card-header">
              <div>
                <div className="card-type-tag">
                  <span className="type-icon" style={{ background: cfg.color + "18" }}>
                    <span style={{ color: cfg.color, display: "inline-flex", width: 12, height: 12 }}><Icon /></span>
                  </span>
                  {cfg.label}
                </div>
                <div className="card-title">{a.title}</div>
              </div>
              <span className={`badge ${a.status}`}>
                <span className="badge-dot" />
                {a.status === "in_progress" ? "Live" : a.status === "completed" ? "Done" : "Open"}
              </span>
            </div>
            <div className="card-meta">
              <div className="meta-item">
                <span style={{ display: "inline-flex", width: 14, height: 14 }}><Icons.Users /></span>
                <span className="meta-value">{a.players.length}</span>
                <span style={{ color: "var(--text-muted)" }}>/ {a.maxPlayers}</span>
              </div>
              <div className="meta-item">
                <span style={{ display: "inline-flex", width: 14, height: 14 }}><Icons.Diamond /></span>
                <span className="meta-value">{a.betAmount}</span>
                <span style={{ color: "var(--text-muted)" }}>MON</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
