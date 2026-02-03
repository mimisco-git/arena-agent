/**
 * gameEngine.js — game state & scoring per GameType
 *
 * Has hardcoded fallbacks for every game type so the app works
 * in demo / CI mode even if Groq is unreachable.
 */
const brain = require("./agentBrain");

// ── fallback data (used when Groq is offline) ───────────────────────────────
const FALLBACK_TRIVIA = [
  { question: "What consensus mechanism does Monad use?",
    answer: "Proof of Stake", options: ["Proof of Work","Proof of Stake","Proof of Authority","DAG"], answerIndex: 1 },
  { question: "What does DeFi stand for?",
    answer: "Decentralized Finance", options: ["Digital Finance","Decentralized Finance","Distributed Funds","Digital Futures"], answerIndex: 1 },
  { question: "Which token standard defines fungible tokens on EVM chains?",
    answer: "ERC-20", options: ["ERC-721","ERC-1155","ERC-20","BEP-20"], answerIndex: 2 }
];

const FALLBACK_PREDICTION = {
  scenario: "MON hits $5 within 24 hours",
  question: "Will MON price exceed $5 in the next 24 hours?",
  options: ["Yes", "No"],
  resolveHint: "Check CoinGecko at end time"
};

const FALLBACK_CARD_DECK = {
  decks: [
    [
      { name: "Dragon",  attack: 9, defense: 4, flavor: "Ancient fire wyrm" },
      { name: "Shield",  attack: 2, defense: 9, flavor: "Unbreakable barrier" },
      { name: "Hacker",  attack: 7, defense: 5, flavor: "Exploits every weakness" },
      { name: "Oracle",  attack: 4, defense: 7, flavor: "Sees all futures" },
      { name: "Bomb",    attack: 10, defense: 1, flavor: "High risk, high reward" }
    ],
    [
      { name: "Phoenix", attack: 8, defense: 6, flavor: "Rises from the ashes" },
      { name: "Wall",    attack: 1, defense: 10, flavor: "Nothing gets through" },
      { name: "Thief",   attack: 6, defense: 5, flavor: "Steals the show" },
      { name: "Wizard",  attack: 5, defense: 8, flavor: "Commands the elements" },
      { name: "Cannon",  attack: 10, defense: 2, flavor: "One shot, one kill" }
    ]
  ],
  rules: "Each round both players play one card. Highest attack wins the round. Best of 3 rounds wins the duel."
};

// ── safe AI call wrapper — returns fallback on failure ──────────────────────
async function tryAI(fn, fallback) {
  try { return await fn(); }
  catch (e) {
    console.warn("⚠️  AI call failed, using fallback:", e.message?.slice(0, 60));
    return fallback;
  }
}

// ─────────────────────────────────────────────
// initialise game data
// ─────────────────────────────────────────────
async function initGame(arena) {
  switch (arena.gameType) {
    case 0: return await initPrediction(arena);
    case 1: return await initTrivia(arena);
    case 2: return await initTrading(arena);
    case 3: return await initStrategy(arena);
    default: throw new Error("Unknown game type");
  }
}

// ── PREDICTION ──
async function initPrediction(arena) {
  const scenario = await tryAI(
    () => brain.generatePredictionScenario(),
    FALLBACK_PREDICTION
  );
  return { type: "prediction", scenario, choices: {}, resolved: false, outcome: null };
}

// ── TRIVIA ──
async function initTrivia(arena) {
  const questions = await tryAI(
    () => brain.generateTriviaQuestions("blockchain, DeFi, Web3, and crypto", 3),
    FALLBACK_TRIVIA
  );
  return {
    type: "trivia",
    questions,
    totalRounds: questions.length,
    currentRound: 0,
    scores:  {},
    answers: {}
  };
}

// ── TRADING ──
async function initTrading(arena) {
  const portfolios = {};
  arena.players.forEach(p => {
    portfolios[p.address] = { cash: 1000, holdings: { MON: 0, ETH: 0, BTC: 0 }, pnl: 0 };
  });
  return {
    type: "trading",
    portfolios,
    startPrices:   { MON: 1.20, ETH: 1800, BTC: 45000 },
    currentPrices: { MON: 1.20, ETH: 1800, BTC: 45000 },
    trades: []
  };
}

// ── STRATEGY ──
async function initStrategy(arena) {
  const deckData = await tryAI(
    () => brain.generateCardDeck(arena.players.length),
    FALLBACK_CARD_DECK
  );
  const playerDecks = {};
  arena.players.forEach((p, i) => {
    playerDecks[p.address] = deckData.decks[i % deckData.decks.length];
  });
  return {
    type: "strategy",
    rules: deckData.rules,
    decks: playerDecks,
    played: {},
    roundScores: {},
    currentRound: 0,
    totalRounds: 3
  };
}

// ─────────────────────────────────────────────
// process a player submission
// ─────────────────────────────────────────────
async function processSubmission(arena, { playerAddress, answer, roundIndex }) {
  const g = arena.gameData;
  if (!g) return { accepted: false, message: "Game not initialised" };

  switch (arena.gameType) {
    case 0:  // prediction
      g.choices[playerAddress] = answer;
      return { accepted: true, message: "Prediction recorded" };

    case 1: {  // trivia
      if (g.scores[playerAddress]  === undefined) g.scores[playerAddress]  = 0;
      if (!g.answers[playerAddress])               g.answers[playerAddress] = [];

      const q = g.questions[roundIndex];
      if (!q) return { accepted: false, message: "Invalid round" };

      const isCorrect = (answer === q.answerIndex);
      const pts       = isCorrect ? 100 : 0;
      g.scores[playerAddress] += pts;
      g.answers[playerAddress].push({ roundIndex, answer, score: pts, correct: isCorrect });

      return { accepted: true, score: pts, correct: isCorrect, totalScore: g.scores[playerAddress] };
    }

    case 2: {  // trading
      const portfolio = g.portfolios[playerAddress];
      if (!portfolio) return { accepted: false, message: "Not a player" };

      const { asset, action, qty } = answer;
      const price = g.currentPrices[asset];
      if (!price) return { accepted: false, message: "Unknown asset" };

      if (action === "buy") {
        const cost = price * qty;
        if (portfolio.cash < cost) return { accepted: false, message: "Insufficient cash" };
        portfolio.cash            -= cost;
        portfolio.holdings[asset]  = (portfolio.holdings[asset] || 0) + qty;
      } else if (action === "sell") {
        if ((portfolio.holdings[asset] || 0) < qty)
          return { accepted: false, message: "Insufficient holdings" };
        portfolio.holdings[asset] -= qty;
        portfolio.cash            += price * qty;
      }

      g.trades.push({ playerAddress, asset, action, qty, price, t: Date.now() });
      return { accepted: true, portfolio };
    }

    case 3: {  // strategy
      if (!g.played[playerAddress])       g.played[playerAddress]       = [];
      if (!g.roundScores[playerAddress])  g.roundScores[playerAddress]  = 0;

      const cardIndex = answer;
      const deck      = g.decks[playerAddress];
      if (!deck || cardIndex < 0 || cardIndex >= deck.length)
        return { accepted: false, message: "Invalid card" };

      const card = deck[cardIndex];
      g.played[playerAddress].push({ cardIndex, card, round: roundIndex });
      g.roundScores[playerAddress] += card.attack;

      return { accepted: true, card, roundScore: g.roundScores[playerAddress] };
    }

    default:
      return { accepted: false, message: "Unknown game type" };
  }
}

// ─────────────────────────────────────────────
// Determine winners
// ─────────────────────────────────────────────
async function determineWinners(arena) {
  const g       = arena.gameData;
  const players = arena.players.map(p => p.address);

  // safety: if no game data, everyone wins (refund scenario)
  if (!g) return players;

  switch (arena.gameType) {
    case 0: {  // prediction
      if (!g.outcome) g.outcome = Math.random() < 0.5 ? "Yes" : "No";
      const winners = players.filter(addr => g.choices && g.choices[addr] === g.outcome);
      return winners.length > 0 ? winners : players;
    }

    case 1: {  // trivia — highest score
      let max = -1;
      players.forEach(addr => { const s = (g.scores && g.scores[addr]) || 0; if (s > max) max = s; });
      return players.filter(addr => ((g.scores && g.scores[addr]) || 0) === max);
    }

    case 2: {  // trading — highest portfolio value
      if (!g.portfolios) return players;
      const pnls = {};
      players.forEach(addr => {
        const p = g.portfolios[addr];
        if (!p) { pnls[addr] = 0; return; }
        let value = p.cash;
        for (const [asset, qty] of Object.entries(p.holdings)) {
          value += (g.currentPrices?.[asset] || 0) * qty;
        }
        pnls[addr] = value - 1000;
      });
      const maxPnl = Math.max(...Object.values(pnls));
      return players.filter(addr => pnls[addr] === maxPnl);
    }

    case 3: {  // strategy — highest round score
      let max = -1;
      players.forEach(addr => { const s = (g.roundScores && g.roundScores[addr]) || 0; if (s > max) max = s; });
      return players.filter(addr => ((g.roundScores && g.roundScores[addr]) || 0) === max);
    }

    default: return players;
  }
}

// ── tick mock prices ─────────────────────────────────────────────────────────
function tickPrices(arena) {
  if (arena.gameType !== 2 || !arena.gameData?.currentPrices) return;
  const p = arena.gameData.currentPrices;
  for (const key of Object.keys(p)) {
    p[key] *= (1 + (Math.random() - 0.5) * 0.06);
    p[key] = parseFloat(p[key].toFixed(4));
  }
}

module.exports = { initGame, processSubmission, determineWinners, tickPrices };
