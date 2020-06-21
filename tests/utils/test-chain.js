require("dotenv").config();

const { ethers } = require("ethers");
const ganache = require("ganache-core");

const PORT = 8545;

// fork off mainnet with a specific account preloaded with 1000 ETH
const server = ganache.server({
  port: PORT,
  fork: process.env.MAINNET_NODE_URL,
  network_id: 1,
  accounts: [
    {
      secretKey: process.env.PRIV_KEY_TEST,
      balance: ethers.utils.hexlify(ethers.utils.parseEther("100")),
    },
    {
      secretKey: process.env.PRIV_KEY_DEPLOY,
      balance: ethers.utils.hexlify(ethers.utils.parseEther("100")),
    },
  ],
});

server.listen(PORT, (err, chain) => {
});
