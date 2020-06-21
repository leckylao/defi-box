require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

// let truffle know what chain to migrate your contracts to
module.exports = {
  compilers: {
    solc: {
      version: '^0.6.0',
      // parser: "solcjs",  // Leverages solc-js purely for speedy parsing
      settings: {
        optimizer: {
          enabled: true
          // runs: <number>   // Optimize for how many times you intend to run the code
        }
        // evmVersion: <string> // Default: "petersburg"
      }
    }
  },
  networks: {
    test: {
      skipDryRun: true,
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      provider: () => new HDWalletProvider(
        process.env.PRIV_KEY_DEPLOY,
        "http://127.0.0.1:8545",
      ),
    },
  },
};
