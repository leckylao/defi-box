require("dotenv").config();

const { ethers } = require("ethers");
const Ganache = require("ganache-core");
const NodeEnvironment = require("jest-environment-node");

const startChain = async () => {
  const ganache = Ganache.provider({
    fork: "http://127.0.0.1:8545",
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

  const provider = new ethers.providers.Web3Provider(ganache);
  const wallet1 = new ethers.Wallet(process.env.PRIV_KEY_TEST, provider);
  const wallet2 = new ethers.Wallet(process.env.PRIV_KEY_DEPLOY, provider);

  return { wallets: [wallet1, wallet2], provider: provider };
};

class CustomEnvironment extends NodeEnvironment {

  constructor(config, context) {
    super(config);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();

    const data = await startChain();
    this.global.wallets = data.wallets;
    this.global.provider = data.provider;
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;
