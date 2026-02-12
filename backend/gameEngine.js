// ═══════════════════════════════════════════════════════════════
// REAL-TIME AI GAME ENGINE
// Handles live game sessions, player submissions, AI judging
// ═══════════════════════════════════════════════════════════════

const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Game sessions storage (in production, use Redis/PostgreSQL)
const gameSessions = new Map();
const playerSubmissions = new Map();

// ═══════════════════════════════════════════════════════════════
// GAME TYPE GENERATORS
// ═══════════════════════════════════════════════════════════════

async function generatePredictionGame() {
  const prompt = `Generate a crypto/tech prediction scenario. Return ONLY valid JSON with no markdown:
{
  "scenario": "brief future scenario (20-30 words)",
  "question": "prediction question",
  "options": ["option A", "option B", "option C", "option D"],
  "correctAnswer": 0-3,
  "reasoning": "why this is the likely outcome"
}

Make it about crypto prices, blockchain adoption, or tech trends in the next 7 days.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 300
    });

    const content = completion.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI generation error:', error);
    // Fallback
    return {
      scenario: "Bitcoin's price movement in the next 7 days given recent market trends",
      question: "Will BTC reach $110,000 by next week?",
      options: ["Yes, above $110k", "No, stays $100-110k", "No, drops below $100k", "Volatile, unclear"],
      correctAnswer: 1,
      reasoning: "Current market consolidation suggests stability in range"
    };
  }
}

async function generateTriviaGame() {
  const prompt = `Generate a crypto/blockchain trivia question. Return ONLY valid JSON:
{
  "question": "challenging trivia question about crypto/blockchain/Web3",
  "options": ["answer A", "answer B", "answer C", "answer D"],
  "correctAnswer": 0-3,
  "explanation": "brief explanation of correct answer"
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 250
    });

    const content = completion.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      question: "What consensus mechanism does Ethereum currently use?",
      options: ["Proof of Work", "Proof of Stake", "Delegated PoS", "Proof of Authority"],
      correctAnswer: 1,
      explanation: "Ethereum switched to Proof of Stake in September 2022 (The Merge)"
    };
  }
}

async function generateTradingGame() {
  const assets = ['BTC', 'ETH', 'SOL', 'AVAX', 'MATIC'];
  const prices = {};
  
  // Generate random starting prices
  assets.forEach(asset => {
    prices[asset] = Math.floor(Math.random() * 1000) + 100;
  });

  return {
    assets,
    startingPrices: prices,
    duration: 300, // 5 minutes
    instructions: "Buy and sell assets to maximize your portfolio value. Prices update every 30 seconds."
  };
}

async function generateStrategyGame() {
  const prompt = `Generate a strategy card game scenario. Return ONLY valid JSON:
{
  "scenario": "battle scenario",
  "playerCards": [{"name": "card name", "power": 1-10, "effect": "special effect"}],
  "aiCards": [{"name": "card name", "power": 1-10, "effect": "special effect"}],
  "rules": "brief rules explanation"
}

Create 5 cards for player and 5 for AI. Make it blockchain/crypto themed.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 400
    });

    const content = completion.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      scenario: "Blockchain Battle: Defend the network from attacks",
      playerCards: [
        { name: "Validator", power: 7, effect: "Double defense" },
        { name: "Smart Contract", power: 5, effect: "Auto-execute" },
        { name: "Node Operator", power: 6, effect: "Network boost" },
        { name: "Developer", power: 4, effect: "Code shield" },
        { name: "Community", power: 8, effect: "United power" }
      ],
      aiCards: [
        { name: "51% Attack", power: 9, effect: "Control attempt" },
        { name: "Bug Exploit", power: 6, effect: "Steal tokens" },
        { name: "DDoS", power: 7, effect: "Network slowdown" },
        { name: "Phishing", power: 5, effect: "Social attack" },
        { name: "Rug Pull", power: 8, effect: "Drain liquidity" }
      ],
      rules: "Play cards strategically. Higher power wins. Special effects can change outcomes."
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// GAME SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════

async function createGameSession(arenaId, gameType) {
  let gameData;

  switch(gameType) {
    case 0: // Prediction
      gameData = await generatePredictionGame();
      break;
    case 1: // Trivia
      gameData = await generateTriviaGame();
      break;
    case 2: // Trading
      gameData = await generateTradingGame();
      break;
    case 3: // Strategy
      gameData = await generateStrategyGame();
      break;
    default:
      gameData = await generatePredictionGame();
  }

  const session = {
    arenaId,
    gameType,
    gameData,
    startTime: Date.now(),
    players: [],
    submissions: new Map(),
    status: 'active'
  };

  gameSessions.set(arenaId, session);
  return session;
}

function getGameSession(arenaId) {
  return gameSessions.get(arenaId);
}

// ═══════════════════════════════════════════════════════════════
// PLAYER SUBMISSION HANDLING
// ═══════════════════════════════════════════════════════════════

function submitPlayerAnswer(arenaId, playerAddress, answer) {
  const session = gameSessions.get(arenaId);
  if (!session) {
    return { success: false, error: 'Game session not found' };
  }

  if (session.status !== 'active') {
    return { success: false, error: 'Game is not active' };
  }

  // Store submission
  session.submissions.set(playerAddress, {
    answer,
    timestamp: Date.now()
  });

  return { success: true, message: 'Answer submitted!' };
}

// ═══════════════════════════════════════════════════════════════
// AI JUDGING
// ═══════════════════════════════════════════════════════════════

async function judgeGame(arenaId) {
  const session = gameSessions.get(arenaId);
  if (!session) return { success: false, error: 'Session not found' };

  const { gameType, gameData, submissions } = session;
  const results = [];

  switch(gameType) {
    case 0: // Prediction
    case 1: // Trivia
      // Simple correctness check
      for (const [player, submission] of submissions.entries()) {
        const isCorrect = submission.answer === gameData.correctAnswer;
        results.push({
          player,
          score: isCorrect ? 100 : 0,
          correct: isCorrect
        });
      }
      break;

    case 2: // Trading
      // Calculate portfolio values
      for (const [player, submission] of submissions.entries()) {
        const portfolioValue = calculatePortfolioValue(submission.answer);
        results.push({
          player,
          score: portfolioValue,
          finalValue: portfolioValue
        });
      }
      break;

    case 3: // Strategy
      // AI judges strategy effectiveness
      for (const [player, submission] of submissions.entries()) {
        const score = await judgeStrategyWithAI(submission.answer, gameData);
        results.push({
          player,
          score
        });
      }
      break;
  }

  // Sort by score and determine winners
  results.sort((a, b) => b.score - a.score);
  
  const topScore = results[0]?.score || 0;
  const winners = results.filter(r => r.score === topScore).map(r => r.player);

  session.status = 'completed';
  session.results = results;
  session.winners = winners;

  return {
    success: true,
    winners,
    results,
    gameData: {
      correctAnswer: gameData.correctAnswer,
      explanation: gameData.explanation || gameData.reasoning
    }
  };
}

async function judgeStrategyWithAI(playerMoves, gameData) {
  try {
    const prompt = `You are judging a strategy game. 

Game scenario: ${gameData.scenario}
Player's moves: ${JSON.stringify(playerMoves)}
Available cards: ${JSON.stringify(gameData.playerCards)}

Rate the strategy effectiveness from 0-100 based on:
- Card selection timing
- Power optimization
- Effect utilization
- Overall tactics

Return ONLY a number 0-100.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 50
    });

    const score = parseInt(completion.choices[0].message.content.trim());
    return isNaN(score) ? 50 : Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error('AI judging error:', error);
    return 50; // Default score
  }
}

function calculatePortfolioValue(portfolio) {
  // Simple portfolio calculation
  let total = 1000; // Starting amount
  
  if (portfolio && portfolio.holdings) {
    for (const [asset, amount] of Object.entries(portfolio.holdings)) {
      total += amount * (Math.random() * 100 + 50); // Simulated price
    }
  }
  
  return Math.floor(total);
}

// ═══════════════════════════════════════════════════════════════
// REAL-TIME PRICE UPDATES (For Trading Game)
// ═══════════════════════════════════════════════════════════════

const tradingPrices = new Map();

function updateTradingPrices(arenaId) {
  const session = gameSessions.get(arenaId);
  if (!session || session.gameType !== 2) return;

  const assets = session.gameData.assets;
  const newPrices = {};

  assets.forEach(asset => {
    const currentPrice = tradingPrices.get(asset) || session.gameData.startingPrices[asset];
    const change = (Math.random() - 0.5) * 50; // ±25
    newPrices[asset] = Math.max(10, Math.floor(currentPrice + change));
    tradingPrices.set(asset, newPrices[asset]);
  });

  return newPrices;
}

// Update prices every 30 seconds for active trading games
setInterval(() => {
  for (const [arenaId, session] of gameSessions.entries()) {
    if (session.gameType === 2 && session.status === 'active') {
      const newPrices = updateTradingPrices(arenaId);
      session.currentPrices = newPrices;
    }
  }
}, 30000);

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

module.exports = {
  createGameSession,
  getGameSession,
  submitPlayerAnswer,
  judgeGame,
  updateTradingPrices,
  gameSessions
};
