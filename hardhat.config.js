require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    monadTestnet: {
      url: process.env.MONAD_RPC_URL || "https://testnet-rpc.monad.xyz",
      chainId: 10200,
      accounts: process.env.OPERATOR_PRIVATE_KEY
        ? [process.env.OPERATOR_PRIVATE_KEY]
        : [],
    },
  },
  defaultNetwork: "monadTestnet",
};
