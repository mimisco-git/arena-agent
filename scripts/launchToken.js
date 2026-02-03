require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { ethers } = require("ethers");

// Nad.fun BondingCurveRouter on Monad Testnet
const ROUTER_ADDRESS = "0x6F6B8F1a20703309951a5127c45B49b1CD981A22";

// Minimal ABI for create() function
const ROUTER_ABI = [
  "function create(tuple(string name, string symbol, string tokenURI, uint256 amountOut, bytes32 salt, uint8 actionId) params) payable returns (address token, address pool)"
];

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
  const wallet = new ethers.Wallet(process.env.OPERATOR_PRIVATE_KEY, provider);
  
  console.log("\n🪙 Launching $ARENA Token on nad.fun");
  console.log("=" .repeat(60));
  console.log("📡 RPC:       ", process.env.MONAD_RPC_URL);
  console.log("🔑 Deployer:  ", wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Balance:   ", ethers.formatEther(balance), "MON");
  
  if (balance < ethers.parseEther("2")) {
    console.error("\n❌ Need at least 2 MON (1 MON deploy fee + 1 MON initial buy)");
    process.exit(1);
  }
  
  const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, wallet);
  
  // Token metadata
  const metadata = {
    name: "Arena Agent",
    symbol: "ARENA",
    description: "Autonomous AI Gaming & Wagering Agent powering competitive arenas on Monad. Join arenas, compete in AI-judged games (prediction, trivia, trading, strategy), and earn through skill-based wagering.",
    image: "https://i.imgur.com/placeholder.png", // Replace with actual image URL
    links: {
      website: "https://moltiverse.dev",
      github: "https://github.com/yourusername/arena-agent",
      twitter: "https://twitter.com/ArenaAgent"
    }
  };
  
  // Upload metadata to IPFS or use a public URL
  const tokenURI = "https://arweave.net/placeholder"; // Replace with actual metadata URL
  
  const params = {
    name: "Arena Agent",
    symbol: "ARENA",
    tokenURI: tokenURI,
    amountOut: ethers.parseEther("100000"), // Initial buy amount (tokens you'll receive)
    salt: ethers.randomBytes(32),
    actionId: 0
  };
  
  const deployFee = ethers.parseEther("1");     // 1 MON deploy fee
  const initialBuy = ethers.parseEther("1");    // 1 MON initial buy
  const totalValue = deployFee + initialBuy;
  
  console.log("\n🎯 Token Parameters:");
  console.log("   Name:        ", params.name);
  console.log("   Symbol:      ", params.symbol);
  console.log("   Initial Buy: ", ethers.formatEther(initialBuy), "MON");
  console.log("   Deploy Fee:  ", ethers.formatEther(deployFee), "MON");
  console.log("   Total:       ", ethers.formatEther(totalValue), "MON");
  
  console.log("\n🚀 Creating token...");
  
  try {
    const tx = await router.create(params, { value: totalValue, gasLimit: 3000000 });
    console.log("   TX hash:", tx.hash);
    console.log("\n⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("\n✅ Token launched successfully!");
    console.log("   Block:      ", receipt.blockNumber);
    console.log("   Gas used:   ", receipt.gasUsed.toString());
    
    // Parse event logs to get token and pool addresses
    const iface = new ethers.Interface([
      "event CurveCreate(address indexed creator, address indexed token, address indexed pool, string name, string symbol, string tokenURI, uint256 virtualMonReserve, uint256 virtualTokenReserve, uint256 targetTokenAmount)"
    ]);
    
    let tokenAddress, poolAddress;
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed.name === "CurveCreate") {
          tokenAddress = parsed.args.token;
          poolAddress = parsed.args.pool;
          break;
        }
      } catch {}
    }
    
    if (tokenAddress) {
      console.log("\n🎉 $ARENA Token Details:");
      console.log("   Token:      ", tokenAddress);
      console.log("   Pool:       ", poolAddress);
      console.log("   Trade at:    https://testnet.nad.fun/token/" + tokenAddress);
      
      // Update .env with token address
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
      console.log("\n⚠️  Could not parse token address from logs");
      console.log("   Check transaction manually:", receipt.hash);
    }
    
  } catch (error) {
    console.error("\n❌ Launch failed:", error.message);
    if (error.data) console.error("   Revert reason:", error.data);
    process.exit(1);
  }
}

main().catch(console.error);
