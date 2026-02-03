require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { ethers } = require("ethers");
const fs         = require("fs");
const path       = require("path");

async function main() {
  // ── provider + signer ──
  const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
  const signer   = new ethers.Wallet(process.env.OPERATOR_PRIVATE_KEY, provider);

  console.log("📡 RPC:            ", process.env.MONAD_RPC_URL);
  console.log("🔑 Operator wallet:", signer.address);

  // ── balance check ──
  const bal = await provider.getBalance(signer.address);
  console.log("💰 Balance:        ", ethers.formatEther(bal), "MON");
  if (bal === 0n) {
    console.error("❌ Wallet has zero balance. Fund via https://testnet.monad.xyz");
    process.exit(1);
  }

  // ── load compiled contract ──
  const artifact = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../artifacts/ArenaAgent.json"), "utf8")
  );

  // ── deploy ──
  console.log("🚀 Deploying ArenaAgent...");
  const factory  = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
  const contract = await factory.deploy();

  console.log("⏳ Waiting for tx receipt...");
  const receipt = await contract.deploymentTransaction().wait(1);

  console.log("\n✅ ArenaAgent deployed!");
  console.log("   Contract address:", contract.target);
  console.log("   TX hash:         ", receipt.hash);
  console.log("   Block:           ", receipt.blockNumber);
  console.log("   Gas used:        ", receipt.gasUsed.toString());

  // ── persist address into .env ──
  const envPath  = path.resolve(__dirname, "../.env");
  let   envText  = fs.readFileSync(envPath, "utf8");
  envText = envText.replace(
    /^ARENA_CONTRACT_ADDRESS=.*$/m,
    `ARENA_CONTRACT_ADDRESS=${contract.target}`
  );
  fs.writeFileSync(envPath, envText);
  console.log("   .env updated    ✅");
}

main().catch(e => { console.error(e); process.exit(1); });
