// ═══════════════════════════════════════════════════════════════
// DEPLOY ARENA WAGERING CONTRACT TO MONAD TESTNET
// ═══════════════════════════════════════════════════════════════

const { ethers } = require('hardhat');

async function main() {
  console.log('\n🚀 Deploying ArenaWagering to Monad Testnet...\n');

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log('📝 Deploying with account:', deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('💰 Account balance:', ethers.formatEther(balance), 'MON\n');

  if (balance === 0n) {
    console.log('❌ ERROR: No MON balance!');
    console.log('👉 Get MON from faucet:');
    console.log('   - https://faucet.monad.xyz/');
    console.log('   - https://faucet.quicknode.com/monad\n');
    process.exit(1);
  }

  // Deploy contract
  console.log('📦 Deploying contract...');
  const ArenaWagering = await ethers.getContractFactory('ArenaWagering');
  const contract = await ArenaWagering.deploy();
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log('\n✅ Contract deployed successfully!');
  console.log('📍 Contract Address:', address);
  console.log('🔗 Explorer:', `https://testnet.monadexplorer.com/address/${address}`);
  
  // Verify contract info
  const owner = await contract.owner();
  const platformFee = await contract.platformFee();
  const totalArenas = await contract.getTotalArenas();
  
  console.log('\n📊 Contract Info:');
  console.log('   Owner:', owner);
  console.log('   Platform Fee:', platformFee.toString() + '%');
  console.log('   Total Arenas:', totalArenas.toString());
  
  // Save deployment info
  const deployment = {
    network: 'monad-testnet',
    chainId: 10143,
    contractAddress: address,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    txHash: contract.deploymentTransaction()?.hash,
    explorerUrl: `https://testnet.monadexplorer.com/address/${address}`
  };
  
  const fs = require('fs');
  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deployment, null, 2)
  );
  
  console.log('\n💾 Deployment info saved to deployment.json');
  
  // Instructions
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Copy contract address:', address);
  console.log('2. Update frontend/.env:');
  console.log(`   VITE_CONTRACT_ADDRESS=${address}`);
  console.log('3. Test contract:');
  console.log('   npx hardhat run scripts/test-contract.js --network monad');
  console.log('\n✨ Deployment complete!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Deployment failed:');
    console.error(error);
    process.exit(1);
  });
