require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const express   = require("express");
const cors      = require("cors");
const { v4: uuidv4 } = require("uuid");
const agentBrain = require("./agentBrain");
const gameEngine = require("./gameEngine");
const chainService = require("./chainService");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// In-memory store (mirrors on-chain arenas with game state)
// ─────────────────────────────────────────────
const gameStates = {};   // arenaId → { state, players, log }

// ─────────────────────────────────────────────
// Health
// ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), arenas: Object.keys(gameStates).length });
});

// ─────────────────────────────────────────────
// Create Arena — operator (or frontend) calls this
// ─────────────────────────────────────────────
app.post("/api/arenas/create", async (req, res) => {
  try {
    const { title, gameType, betAmount, minPlayers, maxPlayers, durationSec } = req.body;

    const startTime = Math.floor(Date.now() / 1000) + 30;
    const endTime   = startTime + (durationSec || 300);

    // Deploy on-chain (if RPC reachable; otherwise store pending)
    let onChainId = null;
    try {
      onChainId = await chainService.createArena({
        title, gameType, betAmount: betAmount || "0.001",
        minPlayers: minPlayers || 2,
        maxPlayers: maxPlayers || 6,
        startTime, endTime
      });
    } catch (e) {
      console.warn("⚠️  On-chain create skipped (RPC unavailable):", e.message);
    }

    // Store game state locally
    const id = onChainId || uuidv4();
    gameStates[id] = {
      id,
      title:       title || "Arena #" + id,
      gameType:    gameType || 0,
      status:      "open",
      betAmount:   betAmount || "0.001",
      minPlayers:  minPlayers || 2,
      maxPlayers:  maxPlayers || 6,
      startTime,
      endTime,
      players:     [],
      winners:     [],
      log:         [],
      gameData:    {}
    };

    console.log(`✅ Arena created: ${id} — "${gameStates[id].title}" (type ${gameType})`);
    res.json({ success: true, arena: gameStates[id] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────
// List all arenas
// ─────────────────────────────────────────────
app.get("/api/arenas", (req, res) => {
  res.json({ arenas: Object.values(gameStates) });
});

// ─────────────────────────────────────────────
// Get single arena
// ─────────────────────────────────────────────
app.get("/api/arenas/:id", (req, res) => {
  const arena = gameStates[req.params.id];
  if (!arena) return res.status(404).json({ error: "Arena not found" });
  res.json({ arena });
});

// ─────────────────────────────────────────────
// Join Arena
// ─────────────────────────────────────────────
app.post("/api/arenas/:id/join", async (req, res) => {
  try {
    const arena  = gameStates[req.params.id];
    if (!arena)  return res.status(404).json({ error: "Arena not found" });
    if (arena.status !== "open") return res.status(400).json({ error: "Arena not open" });

    const { playerAddress } = req.body;
    if (!playerAddress)      return res.status(400).json({ error: "Need playerAddress" });
    if (arena.players.find(p => p.address === playerAddress))
      return res.status(400).json({ error: "Already joined" });
    if (arena.players.length >= arena.maxPlayers)
      return res.status(400).json({ error: "Arena full" });

    arena.players.push({ address: playerAddress, joinedAt: Date.now() });
    arena.log.push({ t: Date.now(), msg: `${playerAddress.slice(0,8)}… joined` });
    console.log(`Player ${playerAddress.slice(0,8)}… joined arena ${arena.id}`);

    res.json({ success: true, arena });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────
// Start Arena — operator kicks off the game
// ─────────────────────────────────────────────
app.post("/api/arenas/:id/start", async (req, res) => {
  try {
    const arena = gameStates[req.params.id];
    if (!arena) return res.status(404).json({ error: "Arena not found" });
    if (arena.status !== "open") return res.status(400).json({ error: "Not open" });
    if (arena.players.length < arena.minPlayers)
      return res.status(400).json({ error: "Not enough players" });

    arena.status = "in_progress";
    arena.log.push({ t: Date.now(), msg: "Arena started" });

    // AI brain initialises the game (generates questions / cards / etc.)
    arena.gameData = await gameEngine.initGame(arena);
    arena.log.push({ t: Date.now(), msg: "Game initialised by AI" });

    console.log(`Arena ${arena.id} started`);
    res.json({ success: true, arena });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────
// Submit player answer / move
// ─────────────────────────────────────────────
app.post("/api/arenas/:id/submit", async (req, res) => {
  try {
    const arena = gameStates[req.params.id];
    if (!arena) return res.status(404).json({ error: "Arena not found" });
    if (arena.status !== "in_progress") return res.status(400).json({ error: "Not in progress" });

    const { playerAddress, answer, roundIndex } = req.body;
    if (!arena.players.find(p => p.address === playerAddress))
      return res.status(400).json({ error: "Not a player" });

    const result = await gameEngine.processSubmission(arena, { playerAddress, answer, roundIndex });
    arena.log.push({ t: Date.now(), msg: `${playerAddress.slice(0,8)}… submitted round ${roundIndex}` });

    res.json({ success: true, result, arena });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────
// Settle Arena — AI determines winners, pays out
// ─────────────────────────────────────────────
app.post("/api/arenas/:id/settle", async (req, res) => {
  try {
    const arena = gameStates[req.params.id];
    if (!arena) return res.status(404).json({ error: "Arena not found" });
    if (arena.status !== "in_progress") return res.status(400).json({ error: "Not in progress" });

    const winners = await gameEngine.determineWinners(arena);
    arena.winners = winners;
    arena.status  = "completed";
    arena.log.push({ t: Date.now(), msg: `Winners: ${winners.map(w => w.slice(0,8)).join(", ")}` });

    // On-chain settlement (if RPC reachable)
    try {
      await chainService.settleArena(arena.id, winners);
    } catch (e) {
      console.warn("⚠️  On-chain settle skipped:", e.message);
    }

    console.log(`Arena ${arena.id} settled. Winners:`, winners);
    res.json({ success: true, arena });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────
// Auto-create demo arenas on boot
// ─────────────────────────────────────────────
async function seedDemoArenas() {
  const demos = [
    { title: "Prediction Battle: Will MON > $5?", gameType: 0, minPlayers: 2, maxPlayers: 6 },
    { title: "Trivia Showdown: Crypto Edition",   gameType: 1, minPlayers: 2, maxPlayers: 4 },
    { title: "Mini Trading Challenge",            gameType: 2, minPlayers: 2, maxPlayers: 4 },
    { title: "Strategy Card Duel",                gameType: 3, minPlayers: 2, maxPlayers: 2 }
  ];

  for (const d of demos) {
    const id = uuidv4();
    const now = Math.floor(Date.now() / 1000);
    gameStates[id] = {
      id,
      title:      d.title,
      gameType:   d.gameType,
      status:     "open",
      betAmount:  "0.01",
      minPlayers: d.minPlayers,
      maxPlayers: d.maxPlayers,
      startTime:  now + 60,
      endTime:    now + 360,
      players:    [],
      winners:    [],
      log:        [{ t: Date.now(), msg: "Arena seeded" }],
      gameData:   {}
    };
  }
  console.log(`Seeded ${demos.length} demo arenas`);
}

// ─────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`\nArena Agent Backend listening on port ${PORT}\n`);
  await seedDemoArenas();
});
