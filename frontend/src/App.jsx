import { useState, useEffect, useCallback } from "react"
import ArenaList    from "./components/ArenaList"
import ArenaDetail  from "./components/ArenaDetail"
import CreateModal  from "./components/CreateModal"
import Leaderboard  from "./components/Leaderboard"

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://arena-agent-backend.onrender.com"

// ── SVG icon components ──
export const Icons = {
  Stadium: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Crystal: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  BookOpen: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-1H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-1h7z"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Layers: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Diamond: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  Trophy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 2.5-2.5v2.5m8 0V7a2.5 2.5 0 0 1 2.5 2.5H17m-11 3h10"/><path d="M6 9v4a6 6 0 0 0 12 0V9"/><path d="M6 20h12"/><path d="M9 20v2"/><path d="M15 20v2"/>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Wallet: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/>
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

// ── game type config ──
export const GAME_CONFIG = [
  { label: "Prediction", color: "#22d3ee", Icon: Icons.Crystal },
  { label: "Trivia",     color: "#a78bfa", Icon: Icons.BookOpen },
  { label: "Trading",    color: "#34d399", Icon: Icons.TrendingUp },
  { label: "Strategy",   color: "#fbbf24", Icon: Icons.Layers },
]

export default function App() {
  const [arenas, setArenas]           = useState([])
  const [wallet, setWallet]           = useState(null)
  const [view, setView]               = useState("arenas")
  const [selectedArena, setSelected]  = useState(null)
  const [showCreate, setShowCreate]   = useState(false)
  const [toast, setToast]             = useState(null)
  const [loading, setLoading]         = useState(true)
  const [mobileNav, setMobileNav]     = useState(false)
  const [theme, setTheme]             = useState(() => {
    // Load theme from localStorage or default to 'light'
    return localStorage.getItem('arena-theme') || 'light'
  })

  // ── Apply theme to document ──
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('arena-theme', theme)
  }, [theme])

  // ── Toggle theme ──
  function toggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // ── fetch arenas ──
  const fetchArenas = useCallback(async () => {
    try {
      const r = await fetch(`${BACKEND}/api/arenas`)
      const d = await r.json()
      setArenas(d.arenas || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchArenas() }, [fetchArenas])
  useEffect(() => {
    const t = setInterval(fetchArenas, 8000)
    return () => clearInterval(t)
  }, [fetchArenas])

  // ── toast auto-dismiss ──
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  // ── wallet ──
  async function connectWallet() {
    if (wallet) { setWallet(null); return }
    if (!window.ethereum) { setToast("Install MetaMask or Phantom"); return }
    try {
      const accs = await window.ethereum.request({ method: "eth_requestAccounts" })
      setWallet(accs[0])
      setToast("Wallet connected")
      window.ethereum.on("accountsChanged", a => setWallet(a[0] || null))
    } catch { setToast("Connection cancelled") }
  }

  // ── arena actions ──
  async function joinArena(id) {
    if (!wallet) { setToast("Connect wallet first"); return }
    setToast("Joining…")
    const r = await fetch(`${BACKEND}/api/arenas/${id}/join`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerAddress: wallet })
    })
    const d = await r.json()
    if (d.error) { setToast(d.error); return }
    setToast("Joined arena")
    setSelected(d.arena); fetchArenas()
  }

  async function startArena(id) {
    setToast("Starting…")
    const r = await fetch(`${BACKEND}/api/arenas/${id}/start`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    })
    const d = await r.json()
    if (d.error) { setToast(d.error); return }
    setToast("Arena started — AI initialising game")
    setSelected(d.arena); fetchArenas()
  }

  async function submitAnswer(id, answer, roundIndex) {
    if (!wallet) { setToast("Connect wallet first"); return }
    const r = await fetch(`${BACKEND}/api/arenas/${id}/submit`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerAddress: wallet, answer, roundIndex })
    })
    const d = await r.json()
    if (d.error) { setToast(d.error); return }
    setToast("Submitted")
    setSelected(d.arena)
    return d.result
  }

  async function settleArena(id) {
    setToast("Settling…")
    const r = await fetch(`${BACKEND}/api/arenas/${id}/settle`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    })
    const d = await r.json()
    if (d.error) { setToast(d.error); return }
    setToast("Arena settled — winners determined")
    setSelected(d.arena); fetchArenas()
  }

  async function createArena(payload) {
    setToast("Creating…")
    const r = await fetch(`${BACKEND}/api/arenas/create`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    const d = await r.json()
    if (d.error) { setToast(d.error); return }
    setToast("Arena created")
    setShowCreate(false); fetchArenas()
  }

  // ── stats ──
  const totalPots = arenas.reduce((s, a) => s + (parseFloat(a.betAmount) * a.players.length), 0)
  const openCount = arenas.filter(a => a.status === "open").length
  const doneCount = arenas.filter(a => a.status === "completed").length

  function navigate(v) { setView(v); setSelected(null); setMobileNav(false); }

  // ── RENDER ──
  return (
    <div className="shell">
      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Watermark (dark mode only) */}
      <div className="watermark">
        <img src="/logo.svg" alt="Arena Agent" style={{ width: '120px', height: '120px', opacity: 0.6 }} />
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src="/logo-icon.svg" alt="Arena Agent" style={{ width: '34px', height: '34px' }} />
          <div className="logo-text"><span>Arena</span> Agent</div>
        </div>

        <div className="navbar-links">
          <button className={view === "arenas" ? "active" : ""} onClick={() => navigate("arenas")}>Arenas</button>
          <button className={view === "leaderboard" ? "active" : ""} onClick={() => navigate("leaderboard")}>Leaderboard</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Theme toggle button */}
          <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
            {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
          </button>

          <button className={`wallet-btn ${wallet ? "connected" : ""}`} onClick={connectWallet}>
            <span className="dot" />
            <Icons.Wallet />
            {wallet ? wallet.slice(0,6) + "…" + wallet.slice(-4) : "Connect"}
          </button>
          <button className="hamburger" onClick={() => setMobileNav(true)}>
            <Icons.Menu />
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${mobileNav ? "open" : ""}`}>
        <button className="close-mobile" onClick={() => setMobileNav(false)}><Icons.X /></button>
        <button onClick={() => navigate("arenas")}>Arenas</button>
        <button onClick={() => navigate("leaderboard")}>Leaderboard</button>
        <button className={`wallet-btn ${wallet ? "connected" : ""}`} style={{ marginTop: 12 }} onClick={() => { connectWallet(); setMobileNav(false); }}>
          <span className="dot" />{wallet ? wallet.slice(0,6) + "…" + wallet.slice(-4) : "Connect Wallet"}
        </button>
      </div>

      {/* Main */}
      <main className="main-content">
        {/* ── ARENA LIST VIEW ── */}
        {view === "arenas" && !selectedArena && (
          <>
            <div className="hero">
              <h1>Autonomous Gaming Arena</h1>
              <p>AI-powered competitive arenas with on-chain wagering on Monad. Join, compete, and earn.</p>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <div className="label">Live Arenas</div>
                <div className="value" style={{ color: "var(--gold)" }}>{openCount}</div>
              </div>
              <div className="stat-card">
                <div className="label">Completed</div>
                <div className="value" style={{ color: "var(--green)" }}>{doneCount}</div>
              </div>
              <div className="stat-card">
                <div className="label">Total Wagered</div>
                <div className="value" style={{ color: "var(--purple-light)" }}>{totalPots.toFixed(3)} <span style={{ fontSize: 14, fontWeight: 500 }}>MON</span></div>
              </div>
              <div className="stat-card">
                <div className="label">AI Games</div>
                <div className="value" style={{ color: "var(--cyan)" }}>{arenas.length}</div>
              </div>
            </div>

            <div className="section-head">
              <h2>Active Arenas</h2>
              <button className="btn-create" onClick={() => setShowCreate(true)}>
                <span style={{ display: "inline-flex", width: 16, height: 16 }}><Icons.Plus /></span>
                Create Arena
              </button>
            </div>

            {loading
              ? <div className="empty-state">
                  <div className="empty-icon"><img src="/logo-icon.svg" alt="Loading" style={{ width: '64px', height: '64px', opacity: 0.8 }} /></div>
                  <p>Loading arenas…</p>
                </div>
              : <ArenaList arenas={arenas} onSelect={setSelected} />
            }
          </>
        )}

        {/* ── ARENA DETAIL VIEW ── */}
        {view === "arenas" && selectedArena && (
          <ArenaDetail
            arena={selectedArena} wallet={wallet}
            onBack={() => setSelected(null)}
            onJoin={joinArena} onStart={startArena}
            onSubmit={submitAnswer} onSettle={settleArena}
            onToast={setToast}
          />
        )}

        {/* ── LEADERBOARD ── */}
        {view === "leaderboard" && <Leaderboard arenas={arenas} />}
      </main>

      {/* Create Modal */}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={createArena} />}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
