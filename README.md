# 🏟️ Arena Agent — Moltiverse Hackathon

**Autonomous AI Gaming & Wagering Agent on Monad**

An AI-powered agent that creates, manages, and judges competitive gaming arenas with on-chain wagering — built for the [Moltiverse Hackathon](https://moltiverse.dev) Gaming Arena bounty.

---

## What It Does

- **AI Agent Brain** (Groq / Llama-3) generates trivia questions, prediction scenarios, strategy card decks, and narrates live events
- **4 Game Modes**: Prediction Battles, Trivia Showdowns, Trading Challenges, Strategy Card Duels
- **On-chain wagering**: players bet MON via smart contract; winners are paid out automatically
- **Leaderboard**: tracks wins, games played, win rate across all arenas
- **$ARENA token**: launched on nad.fun — holders earn a share of wagering fees

---

## Tech Stack

| Layer | Tech |
|---|---|
| Smart Contract | Solidity 0.8.24 → Monad Testnet |
| AI Brain | Groq API (Llama-3.3-70b) |
| Backend | Express.js + ethers.js |
| Frontend | React 18 + Vite |
| Wallet | MetaMask / any EIP-1193 provider |

---

## Project Structure

```
arena-agent/
├── contracts/
│   └── ArenaAgent.sol          ← wagering + settlement contract
├── scripts/
│   ├── compile.js              ← solc → ABI + bytecode
│   └── deploy.js               ← deploys to Monad testnet
├── backend/
│   ├── server.js               ← Express API (arena CRUD, game flow)
│   ├── agentBrain.js           ← Groq AI (questions, cards, narration)
│   ├── gameEngine.js           ← game logic + scoring per type
│   └── chainService.js         ← ethers wrapper for on-chain calls
├── frontend/
│   ├── src/
│   │   ├── App.jsx             ← root + wallet connect + state
│   │   ├── styles.css          ← dark cyber theme
│   │   └── components/
│   │       ├── ArenaList.jsx   ← arena grid cards
│   │       ├── ArenaDetail.jsx ← join / play / settle view
│   │       ├── CreateModal.jsx ← create arena form
│   │       └── Leaderboard.jsx ← win-rate table
│   └── ...
├── artifacts/
│   └── ArenaAgent.json         ← compiled ABI + bytecode
├── .env                        ← keys (NEVER commit)
└── README.md
```

---

## Quick Start

### 1. Install
```bash
npm install
cd frontend && npm install
```

### 2. Fund your wallet
Your operator wallet: **0x016DBB6772FaC182B5B33B66687054c3177f6bc6**
Get testnet MON at: https://testnet.monad.xyz

### 3. Compile + Deploy Contract
```bash
node scripts/compile.js   # → artifacts/ArenaAgent.json
node scripts/deploy.js    # → deploys + writes address to .env
```

### 4. Run Backend
```bash
npm start                 # Express on :3000
```

### 5. Run Frontend
```bash
cd frontend
npm run dev               # Vite on :5173 (proxies /api → :3000)
```

### 6. Open
```
http://localhost:5173
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Server health + arena count |
| GET | `/api/arenas` | List all arenas |
| GET | `/api/arenas/:id` | Single arena |
| POST | `/api/arenas/create` | Create arena |
| POST | `/api/arenas/:id/join` | Join arena |
| POST | `/api/arenas/:id/start` | Start game (AI initialises) |
| POST | `/api/arenas/:id/submit` | Submit answer / play card |
| POST | `/api/arenas/:id/settle` | AI judges → declares winners |

---

## Environment Variables (`.env`)

```
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
OPERATOR_PRIVATE_KEY=<testnet key>
GROQ_API_KEY=<your groq key>
PORT=3000
ARENA_CONTRACT_ADDRESS=<filled by deploy>
```

---

## Hackathon Targets

- **Gaming Arena Bounty** ($10K) — fully autonomous AI agent running competitive arenas with wagering
- **Agent + Token Track** ($10K + $40K liquidity boost) — $ARENA token on nad.fun, revenue-backed by wagering fees

---

*Built for Moltiverse Hackathon · Feb 2026 · Monad Testnet*
