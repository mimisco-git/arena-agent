// ═══════════════════════════════════════════════════════════════
// ARENA AGENT BACKEND - REAL-TIME AI GAMING SERVER
// Handles live games, player submissions, AI judging
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const {
  createGameSession,
  getGameSession,
  submitPlayerAnswer,
  judgeGame,
  updateTradingPrices,
  gameSessions
} = require('./gameEngine');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory storage (use database in production)
let arenas = [];
let arenaIdCounter = 1;

// ═══════════════════════════════════════════════════════════════
// INITIALIZE WITH LIVE ARENAS
// ═══════════════════════════════════════════════════════════════

async function initializeArenas() {
  console.log('🎮 Initializing live arenas...');
  
  const gameTypes = [
    { type: 0, name: 'Crypto Price Prediction', bet: '0.1' },
    { type: 1, name: 'Blockchain Trivia Challenge', bet: '0.05' },
    { type: 2, name: 'DeFi Trading Competition', bet: '0.15' },
    { type: 3, name: 'Smart Contract Strategy Duel', bet: '0.2' }
  ];

  for (const game of gameTypes) {
    const arena = await createLiveArena(game.type, game.name, game.bet);
    arenas.push(arena);
  }

  console.log(`✅ Created ${arenas.length} live arenas`);
}

async function createLiveArena(gameType, title, betAmount) {
  const id = arenaIdCounter++;
  const now = Math.floor(Date.now() / 1000);
  
  const arena = {
    id,
    title,
    gameType,
    status: 'open',
    betAmount,
    minPlayers: 2,
    maxPlayers: 10,
    startTime: now,
    endTime: now + 600, // 10 minutes
    players: [],
    creator: '0x0000000000000000000000000000000000000000',
    aiGenerated: true,
    liveSession: null
  };

  // Create AI game session
  try {
    const session = await createGameSession(id, gameType);
    arena.liveSession = session;
    console.log(`✅ Arena ${id}: ${title} - AI session created`);
  } catch (error) {
    console.error(`❌ Arena ${id}: Failed to create session`, error);
  }

  return arena;
}

// ═══════════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════════

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    arenas: arenas.length,
    activeSessions: gameSessions.size,
    aiStatus: process.env.GROQ_API_KEY ? 'configured' : 'missing'
  });
});

// Get all arenas
app.get('/api/arenas', (req, res) => {
  const now = Math.floor(Date.now() / 1000);
  
  // Update arena statuses
  arenas.forEach(arena => {
    if (arena.endTime < now && arena.status === 'open') {
      arena.status = 'completed';
    }
    if (arena.players.length >= arena.maxPlayers) {
      arena.status = 'in-progress';
    }
  });

  res.json({ arenas });
});

// Get specific arena
app.get('/api/arenas/:id', (req, res) => {
  const arena = arenas.find(a => a.id === parseInt(req.params.id));
  if (!arena) {
    return res.status(404).json({ error: 'Arena not found' });
  }
  res.json({ arena });
});

// Join arena
app.post('/api/arenas/:id/join', async (req, res) => {
  const { playerAddress } = req.body;
  const arena = arenas.find(a => a.id === parseInt(req.params.id));

  if (!arena) {
    return res.status(404).json({ error: 'Arena not found' });
  }

  if (arena.status !== 'open') {
    return res.status(400).json({ error: 'Arena is not open' });
  }

  if (arena.players.includes(playerAddress)) {
    return res.status(400).json({ error: 'Already joined' });
  }

  if (arena.players.length >= arena.maxPlayers) {
    return res.status(400).json({ error: 'Arena is full' });
  }

  arena.players.push(playerAddress);
  
  // Auto-start if enough players
  if (arena.players.length >= arena.minPlayers) {
    arena.status = 'in-progress';
  }

  res.json({
    success: true,
    arena,
    message: 'Successfully joined arena!'
  });
});

// Get game session (reveals game content when player joins)
app.get('/api/arenas/:id/game', (req, res) => {
  const { playerAddress } = req.query;
  const arena = arenas.find(a => a.id === parseInt(req.params.id));

  if (!arena) {
    return res.status(404).json({ error: 'Arena not found' });
  }

  if (!arena.players.includes(playerAddress)) {
    return res.status(403).json({ error: 'You must join the arena first' });
  }

  const session = getGameSession(arena.id);
  if (!session) {
    return res.status(404).json({ error: 'Game session not found' });
  }

  // Return game data (hide correct answers)
  const gameData = { ...session.gameData };
  delete gameData.correctAnswer;
  delete gameData.reasoning;

  res.json({
    gameType: arena.gameType,
    gameData,
    status: session.status,
    startTime: session.startTime,
    timeRemaining: Math.max(0, arena.endTime - Math.floor(Date.now() / 1000))
  });
});

// Submit answer/move
app.post('/api/arenas/:id/submit', (req, res) => {
  const { playerAddress, answer } = req.body;
  const arena = arenas.find(a => a.id === parseInt(req.params.id));

  if (!arena) {
    return res.status(404).json({ error: 'Arena not found' });
  }

  if (!arena.players.includes(playerAddress)) {
    return res.status(403).json({ error: 'Not a player in this arena' });
  }

  const result = submitPlayerAnswer(arena.id, playerAddress, answer);
  res.json(result);
});

// Get current prices (for trading game)
app.get('/api/arenas/:id/prices', (req, res) => {
  const arena = arenas.find(a => a.id === parseInt(req.params.id));

  if (!arena || arena.gameType !== 2) {
    return res.status(400).json({ error: 'Not a trading game' });
  }

  const session = getGameSession(arena.id);
  if (!session) {
    return res.status(404).json({ error: 'Game session not found' });
  }

  res.json({
    prices: session.currentPrices || session.gameData.startingPrices,
    timestamp: Date.now()
  });
});

// Complete game and judge (admin or automatic after time)
app.post('/api/arenas/:id/complete', async (req, res) => {
  const arena = arenas.find(a => a.id === parseInt(req.params.id));

  if (!arena) {
    return res.status(404).json({ error: 'Arena not found' });
  }

  console.log(`🤖 AI judging arena ${arena.id}: ${arena.title}`);
  
  const result = await judgeGame(arena.id);
  
  if (result.success) {
    arena.status = 'completed';
    arena.winners = result.winners;
    arena.results = result.results;
    
    console.log(`✅ Arena ${arena.id} completed. Winners:`, result.winners);
  }

  res.json(result);
});

// Get leaderboard for completed game
app.get('/api/arenas/:id/results', (req, res) => {
  const arena = arenas.find(a => a.id === parseInt(req.params.id));

  if (!arena) {
    return res.status(404).json({ error: 'Arena not found' });
  }

  if (arena.status !== 'completed') {
    return res.status(400).json({ error: 'Game not completed yet' });
  }

  const session = getGameSession(arena.id);
  
  res.json({
    winners: arena.winners,
    results: arena.results,
    gameData: session?.gameData,
    correctAnswer: session?.gameData?.correctAnswer,
    explanation: session?.gameData?.explanation || session?.gameData?.reasoning
  });
});

// AI Chat endpoint (for testing)
app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key not configured' });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an AI game master for Arena Agent, a Web3 gaming platform. Be helpful and enthusiastic about blockchain gaming.'
        },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({
      response: completion.choices[0].message.content,
      model: 'llama-3.3-70b-versatile'
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'AI request failed' });
  }
});

// ═══════════════════════════════════════════════════════════════
// AUTO-COMPLETE GAMES
// ═══════════════════════════════════════════════════════════════

// Check for games that should be completed
setInterval(async () => {
  const now = Math.floor(Date.now() / 1000);
  
  for (const arena of arenas) {
    if (arena.status === 'in-progress' && arena.endTime <= now) {
      console.log(`⏰ Auto-completing arena ${arena.id}: ${arena.title}`);
      
      const result = await judgeGame(arena.id);
      if (result.success) {
        arena.status = 'completed';
        arena.winners = result.winners;
        arena.results = result.results;
        console.log(`✅ Arena ${arena.id} auto-completed`);
      }
    }
  }
}, 10000); // Check every 10 seconds

// ═══════════════════════════════════════════════════════════════
// CREATE NEW ARENAS PERIODICALLY
// ═══════════════════════════════════════════════════════════════

// Create new arena every 15 minutes
setInterval(async () => {
  const gameTypes = [0, 1, 2, 3];
  const randomType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
  const names = [
    'Crypto Price Prediction',
    'Blockchain Trivia Challenge',
    'DeFi Trading Competition',
    'Smart Contract Strategy Duel'
  ];
  const betAmounts = ['0.05', '0.1', '0.15', '0.2'];

  const arena = await createLiveArena(
    randomType,
    names[randomType],
    betAmounts[Math.floor(Math.random() * betAmounts.length)]
  );

  arenas.push(arena);
  console.log(`🆕 Created new arena: ${arena.title}`);
}, 15 * 60 * 1000);

// ═══════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════

async function startServer() {
  // Initialize arenas
  await initializeArenas();

  app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎮 ARENA AGENT - REAL-TIME AI GAMING SERVER');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🤖 AI Engine: Llama 3.3 70B (Groq)`);
    console.log(`📊 Live Arenas: ${arenas.length}`);
    console.log(`⚡ Real-time gaming: ACTIVE`);
    console.log('');
    console.log('API Endpoints:');
    console.log(`  GET  /api/health`);
    console.log(`  GET  /api/arenas`);
    console.log(`  GET  /api/arenas/:id`);
    console.log(`  POST /api/arenas/:id/join`);
    console.log(`  GET  /api/arenas/:id/game`);
    console.log(`  POST /api/arenas/:id/submit`);
    console.log(`  GET  /api/arenas/:id/prices`);
    console.log(`  POST /api/arenas/:id/complete`);
    console.log(`  GET  /api/arenas/:id/results`);
    console.log(`  POST /api/ai/chat`);
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
  });
}

startServer();
