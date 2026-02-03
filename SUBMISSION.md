# THE ARENA — Autonomous AI Gaming & Wagering Agent

**Moltiverse Hackathon Submission**  
**Track:** Gaming Arena Bounty ($10K) + Agent+Token Track (pending mainnet)

---

## 🎯 What It Does

THE ARENA is an autonomous AI agent that creates and manages competitive gaming arenas with automated wagering on Monad. Players join arenas, compete in AI-judged games, and earn through skill-based competition.

**4 Game Modes:**
- **Prediction Battles** — AI generates scenarios, players predict outcomes
- **Trivia Showdowns** — Multi-round crypto/tech questions with real-time scoring
- **Trading Challenges** — Virtual portfolio competition with live market simulation
- **Strategy Card Duels** — Turn-based card battles with attack/defense mechanics

**Key Features:**
- ✅ Fully autonomous AI game master (Groq Llama 3.3 70B)
- ✅ On-chain wagering via smart contract (Solidity 0.8.24)
- ✅ Fair payouts with 2% protocol fee
- ✅ Premium glassmorphism UI (mobile responsive)
- ✅ Real-time state management across backend + blockchain

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (React + Vite + ethers.js)                   │
│  • Wallet connect (MetaMask)                            │
│  • Arena browsing & creation                            │
│  • Game panels for 4 modes                              │
│  • Leaderboard & stats                                  │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP
┌──────────────────▼──────────────────────────────────────┐
│  Backend (Express + Node.js)                            │
│  • Arena lifecycle management                           │
│  • AI Brain (Groq SDK)                                  │
│  • Game Engine (scoring, winner determination)          │
│  • Chain Service (ethers.js)                            │
└──────────────────┬──────────────────────────────────────┘
                   │ JSON-RPC
┌──────────────────▼──────────────────────────────────────┐
│  Smart Contract (ArenaAgent.sol)                        │
│  • On-chain arena registry                              │
│  • Wager escrow & settlement                            │
│  • Protocol fee (2% → future $ARENA buybacks)           │
│  Deployed: 0xD44801080F88f145F8bfBA03f17FCde3869E39E8   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎮 Game Flow

1. **User connects wallet** → MetaMask on Monad testnet
2. **Browses open arenas** → 4 game types, various bet amounts
3. **Joins arena** → Sends bet amount (e.g., 0.01 MON)
4. **Operator starts game** → AI initializes (generates questions, cards, scenarios)
5. **Players compete** → Submit answers/moves via UI
6. **AI judges** → Determines winners based on game logic
7. **Payout** → Winners split pot (minus 2% fee), settled on-chain

---

## 🚀 Tech Stack

**Frontend:**
- React 18 + Vite 6
- ethers.js 6.13 (wallet + contract interaction)
- CSS custom properties (glassmorphism design system)
- SVG icons (no emoji dependencies)

**Backend:**
- Express 4.21
- Groq SDK (Llama 3.3 70B Speculative Decoding)
- UUID v4 for arena IDs
- In-memory state (mirrors on-chain)

**Smart Contracts:**
- Solidity 0.8.24
- Hardhat 2.22 (compile + deploy)
- OpenZeppelin patterns (Ownable, ReentrancyGuard)

**Blockchain:**
- Monad Testnet (10k TPS, 1s blocks)
- Operator wallet: `0x016DBB6772FaC182B5B33B66687054c3177f6bc6`
- Contract: `0xD44801080F88f145F8bfBA03f17FCde3869E39E8`

---

## 📊 Demo Screenshots

**Homepage — Glassmorphism UI:**
- Live arena cards with SVG icons
- Stats row (Live, Completed, Wagered, AI Games)
- Responsive grid layout

**Arena Detail — Game Panels:**
- Prediction: Yes/No scenario buttons
- Trivia: Multi-round questions with score feedback
- Trading: Portfolio display with live prices
- Strategy: Card deck with attack/defense stats

**Leaderboard:**
- Win rate, games played, total wagered
- Top 3 medal rankings

---

## 🔗 Links

- **GitHub:** [Include your repo link]
- **Contract:** https://testnet.monad.xyz/address/0xD44801080F88f145F8bfBA03f17FCde3869E39E8
- **Video Demo:** [Record 2-min walkthrough]

---

## 🎯 Bounty Fit: Gaming Arena Agent

✅ **Creates competitive gaming arenas** — 4 game modes  
✅ **Automated wagering** — Smart contract escrow + settlement  
✅ **Tournament structure** — Multi-player, min/max player counts  
✅ **AI autonomy** — Generates content, judges outcomes, no human needed

---

## 🪙 Future: $ARENA Token (Agent+Token Track)

**Tokenomics Loop:**
1. Protocol collects 2% fee from every arena settlement
2. Fees auto-buyback $ARENA on nad.fun bonding curve
3. Token holders benefit from platform growth

**Planned for Monad Mainnet Day 1:**
- Launch $ARENA on nad.fun
- Wire ArenaAgent fee wallet to buyback contract
- Community governance for new game modes

---

## 🏆 Why This Wins

1. **Fully functional** — Not a demo, real end-to-end flow
2. **Production UI** — Premium design, mobile responsive
3. **AI autonomy** — Generates questions, scenarios, judges winners
4. **On-chain integrity** — Escrow, settlement, fee distribution
5. **Scalable** — 4 game modes today, infinite extensibility
6. **Early submission** — Day 2 of 16, rolling judging advantage

---

## 🛠️ Run Locally

```bash
# Clone repo
git clone [your-repo] && cd arena-agent

# Install dependencies
npm install && cd frontend && npm install && cd ..

# Configure .env
cp .env.example .env
# Add: MONAD_RPC_URL, OPERATOR_PRIVATE_KEY, GROQ_API_KEY

# Fund operator wallet
# https://testnet.monad.xyz → claim MON

# Deploy contract
node scripts/compile.js && node scripts/deploy.js

# Start backend (Terminal 1)
npm start

# Start frontend (Terminal 2)
cd frontend && npm run dev

# Open http://localhost:5173
```

---

## 📝 License

MIT

---

**Built by:** [Your name/team]  
**Contact:** [Your Twitter/email]  
**Hackathon:** Moltiverse by nad.fun & Monad  
**Submitted:** February 3, 2026
