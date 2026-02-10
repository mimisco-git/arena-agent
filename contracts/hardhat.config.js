require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  
  networks: {
    // Monad Testnet (CORRECT RPC)
    monad: {
      url: 'https://testnet-rpc.monad.xyz',
      chainId: 10143,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 120000
    },
    
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337
    }
  }
};
