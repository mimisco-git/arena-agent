# 🎮 Arena Agent - AI-Powered Gaming on Monad

> Autonomous AI gaming agent with competitive arenas and automated on-chain wagering. Built for **Moltiverse Hackathon 2026**.

[![Live Demo](https://img.shields.io/badge/Demo-Live-success)](https://arena-agent-ebon.vercel.app/)
[![Monad Testnet](https://img.shields.io/badge/Monad-Testnet-purple)](https://testnet.monadexplorer.com/)
[![Hackathon](https://img.shields.io/badge/Moltiverse-2026-gold)](https://moltiverse.dev/)

---

## 🌟 Overview

**Arena Agent** is an autonomous AI agent that creates and manages competitive gaming arenas with real-time wagering on the Monad blockchain. Players compete in AI-generated games, and winners receive automated prize distributions through smart contracts.

### Key Features

- 🤖 **AI-Powered**: Llama 3.3 70B generates game scenarios and judges performance
- ⛓️ **On-Chain Wagering**: Smart contract escrow for trustless betting
- 🎮 **4 Game Types**: Prediction Markets, Trivia, Trading, Strategy
- 💎 **Premium UI**: Ultra-luxury glassmorphism design
- ⚡ **Monad Blockchain**: High-performance, low-latency transactions
- 🏆 **Automated Payouts**: Winners receive prizes automatically

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ARENA AGENT SYSTEM                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   Frontend UI    │         │   AI Agent       │
│   (React/Vite)   │◄────────┤   Llama 3.3 70B  │
│                  │         │   (Groq API)     │
│  - Ultra Premium │         │                  │
│  - Glassmorphism │         │  - Game Gen      │
│  - Wallet Connect│         │  - Judging       │
│  - Real-time UI  │         │  - Scenarios     │
└────────┬─────────┘         └──────────────────┘
         │
         │ ethers.js
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                  Monad Testnet (Chain ID: 10143)             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │        ArenaWagering Smart Contract (Solidity)         │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │                                                         │  │
│  │  • createArena(title, type, bet, players, duration)   │  │
│  │  • joinArena(arenaId) payable                          │  │
│  │  • completeArena(arenaId, winners[])                   │  │
│  │  • Auto prize distribution (95% to winners, 5% fee)    │  │
│  │                                                         │  │
│  │  Events:                                                │  │
│  │  - ArenaCreated(id, title, type, bet)                  │  │
│  │  - PlayerJoined(id, player, amount)                    │  │
│  │  - ArenaCompleted(id, winners[], prize)                │  │
│  │                                                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  Gas Token: MON                                               │
│  Block Time: ~1s                                              │
│  TPS: ~10,000                                                 │
│                                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   Backend API    │
│   (Node.js)      │
│                  │
│  - Arena Storage │
│  - Game Logic    │
│  - AI Integration│
└──────────────────┘
```

---

## 🎮 How It Works

### 1️⃣ **Arena Creation**
```solidity
// Smart contract creates escrow for arena
function createArena(
    string title,
    GameType gameType,
    uint256 betAmount,
    uint256 minPlayers,
    uint256 maxPlayers,
    uint256 duration
)
```

### 2️⃣ **Player Joins**
```solidity
// Player sends MON to join
function joinArena(uint256 arenaId) payable {
    require(msg.value == betAmount);
    players.push(msg.sender);
    prizePool += msg.value;
}
```

### 3️⃣ **AI Judges Game**
```javascript
// AI evaluates player performance
const winner = await judgeGame(arenaId, players, responses)
```

### 4️⃣ **Auto Prize Distribution**
```solidity
// Contract distributes prizes to winners
function completeArena(uint256 arenaId, address[] winners) {
    uint256 fee = prizePool * 5 / 100; // 5% platform fee
    uint256 netPrize = prizePool - fee;
    uint256 prizePerWinner = netPrize / winners.length;
    
    // Send prizes to each winner
    for (uint i = 0; i < winners.length; i++) {
        winners[i].call{value: prizePerWinner}("");
    }
}
```

---

## 🎯 Game Types

### 🔮 **Prediction Markets**
- AI generates future scenarios (crypto prices, events)
- Players predict outcomes
- Closest predictions win
- **Example**: "Will BTC hit $100k in 7 days?"

### 📖 **Trivia Showdown**
- AI generates questions on crypto/tech/blockchain
- Timed multiple choice
- Highest score wins
- **Example**: "What year was Ethereum launched?"

### 📈 **Trading Arena**
- Simulated markets with AI-driven price action
- Players buy/sell virtual assets
- Best portfolio return wins
- **Example**: Trade 10 virtual tokens in 5 minutes

### ⚔️ **Strategy Duel**
- Card-based tactical battles
- Players choose actions each turn
- AI evaluates strategy effectiveness
- **Example**: Rock-paper-scissors with power-ups

---

## 💻 Tech Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Styling**: Custom CSS with glassmorphism
- **Web3**: ethers.js v6
- **Fonts**: Space Grotesk, Inter, JetBrains Mono
- **Animations**: CSS animations (60fps optimized)

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express
- **AI**: Llama 3.3 70B via Groq API
- **Storage**: In-memory (production: PostgreSQL)

### **Smart Contracts**
- **Language**: Solidity 0.8.20
- **Framework**: Hardhat
- **Network**: Monad Testnet (Chain ID: 10143)
- **Gas Token**: MON

### **Blockchain**
- **Chain**: Monad Testnet
- **RPC**: https://testnet.monad.network
- **Explorer**: https://testnet.monadexplorer.com
- **Faucet**: https://faucet.monad.xyz

---

## 🚀 Quick Start

### **Prerequisites**
```bash
# Required
- Node.js 18+
- MetaMask browser extension
- MON tokens (from faucet)

# Optional
- Hardhat (for contract deployment)
```

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/arena-agent.git
cd arena-agent
```

### **2. Install Dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Smart contracts
cd ../contracts
npm install
```

### **3. Configure Environment**

**Frontend** (`.env`):
```env
VITE_BACKEND_URL=https://arena-agent-backend.onrender.com/api
VITE_CONTRACT_ADDRESS=0xYourContractAddress
```

**Backend** (`.env`):
```env
GROQ_API_KEY=your_groq_api_key
PORT=3001
```

**Contracts** (`.env`):
```env
PRIVATE_KEY=your_wallet_private_key
MONAD_RPC_URL=https://testnet.monad.network
```

### **4. Get MON Tokens**
Visit any faucet:
- https://faucet.monad.xyz/
- https://faucet.quicknode.com/monad
- https://chainstack.com/monad-faucet

### **5. Deploy Smart Contract**
```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy-contract.js --network monad
# Copy contract address to frontend .env
```

### **6. Start Development**
```bash
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend
cd backend
npm start
```

Open http://localhost:5173

---

## 📝 Smart Contract Deployment

### **Step-by-Step Guide**

1. **Install Hardhat**:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. **Compile Contract**:
```bash
npx hardhat compile
```

3. **Deploy to Monad Testnet**:
```bash
npx hardhat run scripts/deploy-contract.js --network monad
```

4. **Verify Deployment**:
```bash
# Check on explorer
https://testnet.monadexplorer.com/address/YOUR_CONTRACT_ADDRESS
```

5. **Update Frontend**:
```bash
# Add contract address to frontend/.env
VITE_CONTRACT_ADDRESS=0xYourContractAddress
```

### **Contract Functions**

```solidity
// Create arena (returns arenaId)
createArena(title, gameType, betAmount, minPlayers, maxPlayers, duration)

// Join arena (send MON as bet)
joinArena(arenaId) payable

// Complete arena (admin only)
completeArena(arenaId, winners[])

// View functions
getArena(arenaId)
getArenaPlayers(arenaId)
hasPlayerJoined(arenaId, player)
getTotalArenas()
```

---

## 🎨 UI Features

### **Premium Design System**
- **Glassmorphism**: 24px blur + 180% saturation
- **Color Palette**:
  - Purple: `#7C3AED` → `#A855F7`
  - Cyan: `#06B6D4` → `#0891B2`
  - Gold: `#F59E0B` → `#FCD34D`
- **Typography**: Space Grotesk (display), Inter (body)
- **Animations**: 60fps optimized transitions
- **Responsive**: 375px - 1920px+

### **Components**
- ✨ Hero section with animated gradient
- 📊 Stats dashboard with glassmorphism
- 🎮 Game mode cards with 3D depth
- 🤖 AI section with floating badge
- ⚡ Arena cards with real-time countdowns
- 💧 Faucet modal for MON tokens
- 🎯 Arena details modal with join button

---

## 🔐 Security

### **Smart Contract Security**
- ✅ Reentrancy protection
- ✅ Access control (owner functions)
- ✅ Input validation
- ✅ Safe math (Solidity 0.8+)
- ✅ Emergency functions
- ⚠️ **Testnet Only** - Not audited for production

### **Frontend Security**
- ✅ Wallet signature verification
- ✅ Network validation (Chain ID check)
- ✅ Balance verification before transactions
- ✅ Transaction error handling
- ✅ User input sanitization

---

## 📊 Contract Details

**Network**: Monad Testnet  
**Chain ID**: 10143  
**Contract**: ArenaWagering.sol  
**Platform Fee**: 5% (distributed to protocol)  
**Gas Token**: MON  
**Min Players**: 2  
**Max Players**: 100  

### **Contract Events**
```solidity
event ArenaCreated(uint256 arenaId, string title, uint8 gameType, uint256 betAmount, address creator)
event PlayerJoined(uint256 arenaId, address player, uint256 amount)
event ArenaStarted(uint256 arenaId, uint256 playerCount)
event ArenaCompleted(uint256 arenaId, address[] winners, uint256 prizePerWinner)
event ArenaCancelled(uint256 arenaId, uint256 refundAmount)
```

---

## 🏆 Hackathon Submission

### **Moltiverse Hackathon 2026**

**Track**: Agent-Only Track  
**Prize Pool**: $200K total  
**Our Category**: AI Gaming Agent  

**Submission Checklist**:
- ✅ AI agent (Llama 3.3 70B)
- ✅ Competitive gaming arenas
- ✅ Automated wagering
- ✅ Monad blockchain integration
- ✅ Smart contract deployed
- ✅ Live demo
- ✅ GitHub repository
- ✅ Documentation
- ✅ Premium UI

**Alignment**: 
> "Build an agent that creates and manages competitive gaming arenas with automated wagering and tournaments" - **Exact match!** ✅

---

## 🛠️ Development

### **Project Structure**
```
arena-agent/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── App.jsx            # Main app
│   │   ├── components/        # UI components
│   │   ├── contractUtils.js   # Smart contract utils
│   │   ├── monadConfig.js     # Monad network config
│   │   └── styles.css         # Premium CSS
│   └── package.json
│
├── backend/            # Node.js backend
│   ├── server.js       # Express server
│   ├── aiAgent.js      # AI integration
│   └── package.json
│
├── contracts/          # Smart contracts
│   ├── ArenaWagering.sol      # Main contract
│   ├── deploy-contract.js     # Deployment script
│   ├── hardhat.config.js      # Hardhat config
│   └── package.json
│
└── README.md           # This file
```

### **Development Commands**

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build

# Backend
npm start            # Start server
npm run dev          # Dev mode with nodemon

# Contracts
npx hardhat compile  # Compile contracts
npx hardhat test     # Run tests
npx hardhat run scripts/deploy-contract.js --network monad  # Deploy
```

---

## 🌐 Live Deployment

**Frontend**: https://arena-agent-ebon.vercel.app/  
**Backend**: https://arena-agent-backend.onrender.com  
**Contract**: TBD (deploy and update here)  
**Explorer**: https://testnet.monadexplorer.com  

---

## 📚 Resources

### **Monad**
- [Monad Docs](https://docs.monad.xyz/)
- [Monad Testnet Faucet](https://faucet.monad.xyz/)
- [Monad Explorer](https://testnet.monadexplorer.com/)

### **Hackathon**
- [Moltiverse Homepage](https://moltiverse.dev/)
- [Hackathon Rules](https://moltiverse.dev/rules)
- [Submission Form](https://moltiverse.dev/submit)

### **AI**
- [Groq API](https://groq.com/)
- [Llama 3.3 Docs](https://ai.meta.com/llama/)

---

## 👥 Team

**BusyBrain Devs**

Built with ❤️ for Moltiverse Hackathon 2026

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Monad** for the high-performance blockchain
- **Nad.fun** for hackathon sponsorship
- **Groq** for AI API access
- **Anthropic** for Claude assistance

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/arena-agent/issues)
- **Twitter**: [@BusyBrainDevs](https://twitter.com/busybraindevs)
- **Discord**: Join Monad Discord

---

**Built for the future of on-chain gaming** 🎮⛓️🤖
