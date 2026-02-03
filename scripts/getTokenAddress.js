require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { ethers } = require("ethers");

const TX_HASH = "0xd3fdd65459a4ef5fe42b7ff5da39e9dfbe3795006cfdcf31dfb0b001c5ccdf73";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
  
  console.log("\n🔍 Fetching transaction receipt...");
  const receipt = await provider.getTransactionReceipt(TX_HASH);
  
  if (!receipt) {
    console.error("❌ Transaction not found");
    process.exit(1);
  }
  
  console.log("\n📦 Transaction Details:");
  console.log("   Status:     ", receipt.status === 1 ? "✅ Success" : "❌ Failed");
  console.log("   Block:      ", receipt.blockNumber);
  console.log("   Gas used:   ", receipt.gasUsed.toString());
  console.log("   Logs count: ", receipt.logs.length);
  
  // Try multiple event signatures
  const eventSignatures = [
    "event CurveCreate(address indexed creator, address indexed token, address indexed pool, string name, string symbol, string tokenURI, uint256 virtualMonReserve, uint256 virtualTokenReserve, uint256 targetTokenAmount)",
    "event TokenCreated(address indexed token, address indexed pool, address indexed creator)",
    "event Created(address indexed token, address indexed pool)",
  ];
  
  let tokenAddress, poolAddress;
  
  // Method 1: Try parsing with known event signatures
  for (const sig of eventSignatures) {
    const iface = new ethers.Interface([sig]);
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        console.log("\n✅ Parsed event:", parsed.name);
        console.log("   Args:", parsed.args);
        if (parsed.args.token) {
          tokenAddress = parsed.args.token;
          poolAddress = parsed.args.pool;
          break;
        }
      } catch {}
    }
    if (tokenAddress) break;
  }
  
  // Method 2: If parsing failed, extract addresses from logs directly
  if (!tokenAddress) {
    console.log("\n🔧 Parsing failed, extracting addresses from raw logs...");
    
    for (const log of receipt.logs) {
      console.log("\n   Log", receipt.logs.indexOf(log));
      console.log("   Address:", log.address);
      console.log("   Topics: ", log.topics.slice(0, 3));
      
      // Token and pool are usually in indexed topics
      if (log.topics.length >= 3) {
        // Topic 0 is event signature
        // Topics 1-3 are indexed params (creator, token, pool)
        const possibleToken = "0x" + log.topics[1].slice(26);
        const possiblePool = "0x" + log.topics[2].slice(26);
        
        if (!tokenAddress && possibleToken !== "0x" + "0".repeat(40)) {
          tokenAddress = possibleToken;
          poolAddress = possiblePool;
        }
      }
    }
  }
  
  if (tokenAddress) {
    console.log("\n🎉 $ARENA Token Found!");
    console.log("   Token:   ", tokenAddress);
    console.log("   Pool:    ", poolAddress);
    console.log("   Trade at: https://testnet.nad.fun/token/" + tokenAddress);
    
    // Update .env
    const fs = require("fs");
    const envPath = require("path").resolve(__dirname, "../.env");
    let envContent = fs.readFileSync(envPath, "utf8");
    
    if (envContent.includes("ARENA_TOKEN_ADDRESS=")) {
      envContent = envContent.replace(/ARENA_TOKEN_ADDRESS=.*/g, `ARENA_TOKEN_ADDRESS=${tokenAddress}`);
    } else {
      envContent += `\nARENA_TOKEN_ADDRESS=${tokenAddress}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log("   .env updated ✅");
  } else {
    console.log("\n⚠️  Could not extract token address");
    console.log("   View transaction manually at:");
    console.log("   https://testnet.monad.xyz/tx/" + TX_HASH);
  }
}

main().catch(console.error);
