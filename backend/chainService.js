/**
 * chainService.js — ethers wrapper for on-chain interactions
 *
 * All calls are try/catch'd so the backend keeps running even if
 * Monad testnet is unreachable (dev / CI environments).
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { ethers } = require("ethers");
const fs         = require("fs");
const path       = require("path");

// ── provider + signer ──
const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
const signer   = new ethers.Wallet(process.env.OPERATOR_PRIVATE_KEY, provider);

// ── load ABI (compiled artifact) ──
let abi = [];
try {
  const artifact = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../artifacts/ArenaAgent.json"), "utf8")
  );
  abi = artifact.abi;
} catch (e) {
  console.warn("⚠️  ArenaAgent.json not found — chain calls will be no-ops until deployed.");
}

// ── contract instance (address set after deploy) ──
function getContract() {
  const addr = process.env.ARENA_CONTRACT_ADDRESS;
  if (!addr) throw new Error("ARENA_CONTRACT_ADDRESS not set — run deploy first");
  return new ethers.Contract(addr, abi, signer);
}

// ─────────────────────────────────────────────
// Create arena on-chain
// ─────────────────────────────────────────────
async function createArena({ title, gameType, betAmount, minPlayers, maxPlayers, startTime, endTime }) {
  const contract = getContract();
  const betWei   = ethers.parseEther(String(betAmount));

  console.log("🔗 Creating arena on-chain...");
  const tx = await contract.createArena(
    title,
    gameType,
    betWei,
    minPlayers,
    maxPlayers,
    startTime,
    endTime
  );
  const receipt = await tx.wait(1);

  // extract arena ID from ArenaCreated event
  const event = receipt.logs
    .map(log => { try { return contract.interface.parseLog(log); } catch { return null; } })
    .find(e => e && e.name === "ArenaCreated");

  const id = event ? Number(event.args.id) : null;
  console.log("   ✅ on-chain arena id:", id, "| tx:", receipt.hash);
  return id;
}

// ─────────────────────────────────────────────
// Start arena on-chain
// ─────────────────────────────────────────────
async function startArena(arenaId) {
  const contract = getContract();
  console.log("🔗 Starting arena on-chain...", arenaId);
  const tx      = await contract.startArena(arenaId);
  const receipt = await tx.wait(1);
  console.log("   ✅ started | tx:", receipt.hash);
}

// ─────────────────────────────────────────────
// Settle arena on-chain
// ─────────────────────────────────────────────
async function settleArena(arenaId, winners) {
  const contract = getContract();
  console.log("🔗 Settling arena on-chain...", arenaId, "winners:", winners);
  const tx      = await contract.settleArena(arenaId, winners);
  const receipt = await tx.wait(1);
  console.log("   ✅ settled | tx:", receipt.hash);
}

// ─────────────────────────────────────────────
// Read all arenas from chain
// ─────────────────────────────────────────────
async function fetchArenas() {
  const contract = getContract();
  const count    = await contract.getArenaCount();
  const arenas   = await contract.getAllArenas();
  return { count: Number(count), arenas };
}

module.exports = { createArena, startArena, settleArena, fetchArenas };
