import { useMemo } from "react"
import { Icons } from "../App"

const MEDALS = ["🥇", "🥈", "🥉"]

export default function Leaderboard({ arenas }) {
  const rows = useMemo(() => {
    const map = {}
    
    // Aggregate player data
    arenas.forEach(a => {
      a.players.forEach(p => {
        if (!map[p.address]) {
          map[p.address] = { 
            wins: 0, 
            played: 0, 
            wagered: 0,
            earnings: 0 
          }
        }
        map[p.address].played += 1
        map[p.address].wagered += parseFloat(a.betAmount) || 0
      })
      
      // Count wins - only from completed arenas with winners
      if (a.status === 'completed' && a.winners && a.winners.length > 0) {
        a.winners.forEach(winnerAddr => {
          if (!map[winnerAddr]) {
            map[winnerAddr] = { wins: 0, played: 0, wagered: 0, earnings: 0 }
          }
          map[winnerAddr].wins += 1
          
          // Calculate earnings (total pot divided by winners)
          const totalPot = (parseFloat(a.betAmount) || 0) * a.players.length
          const prizeShare = totalPot / a.winners.length
          map[winnerAddr].earnings += prizeShare
        })
      }
    })
    
    // Convert to array and calculate win rate
    return Object.entries(map)
      .map(([address, d]) => ({ 
        address, 
        ...d, 
        winRate: d.played > 0 ? ((d.wins / d.played) * 100).toFixed(0) : "0" 
      }))
      .sort((a, b) => {
        // Sort by wins first, then by earnings, then by played
        if (b.wins !== a.wins) return b.wins - a.wins
        if (b.earnings !== a.earnings) return b.earnings - a.earnings
        return b.played - a.played
      })
  }, [arenas])

  return (
    <div>
      <div className="hero" style={{ padding: "44px 24px 40px" }}>
        <h1>Leaderboard</h1>
        <p>Top players ranked by wins and earnings across all arenas</p>
      </div>

      {rows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <img src="/logo-icon.svg" alt="Trophy" style={{ width: '64px', height: '64px', opacity: 0.6 }} />
          </div>
          <p>No games played yet — jump into an arena to earn your spot</p>
        </div>
      ) : (
        <div className="leaderboard-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 56 }}>#</th>
                <th>Player</th>
                <th>Wins</th>
                <th>Played</th>
                <th>Win Rate</th>
                <th>Total Earnings</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.address}>
                  <td>
                    <span className="rank">
                      {i < 3
                        ? <span className="rank-medal">{MEDALS[i]}</span>
                        : <span style={{ color: "var(--text-sub)" }}>{i + 1}</span>
                      }
                    </span>
                  </td>
                  <td><span className="lb-address">{r.address.slice(0,8)}…{r.address.slice(-6)}</span></td>
                  <td><span className="lb-wins">{r.wins}</span></td>
                  <td style={{ color: "var(--text-sub)" }}>{r.played}</td>
                  <td><span className={Number(r.winRate) >= 50 ? "lb-rate-good" : "lb-rate-ok"}>{r.winRate}%</span></td>
                  <td><span className="lb-wagered">{r.earnings.toFixed(3)} MON</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
