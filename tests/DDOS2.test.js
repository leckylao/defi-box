require("dotenv").config();
jest.setTimeout(100000);

const { ethers } = require("ethers");
const erc20 = require("@studydefi/money-legos/erc20");

const DDOS2Artifact = require("../build/contracts/DDOS2.json");
const chiArtifact = require("./abi/chi.json");

const DDOS2Interface = new ethers.utils.Interface(DDOS2Artifact.abi);

const chiAddress = "0x0000000000004946c0e9F43F4Dee607b0eF1fA1c"

const fromWei = (x, u = 18) => ethers.utils.formatUnits(x, u);

describe("initial conditions", () => {
  let wallet1, wallet2, DDOS2, provider;

  beforeAll(async () => {
    wallet1 = global.wallets[0];
    wallet2 = global.wallets[1];
    provider = global.provider;

    DDOS2 = new ethers.Contract(
      DDOS2Artifact.networks[1].address,
      DDOS2Artifact.abi,
      wallet1,
    );

    chi = new ethers.Contract(
      chiAddress,
      chiArtifact,
      wallet1,
    );
  });

  test("to function can emit Transfer", async () =>{
    let filter = DDOS2.filters.Transfer(null, wallet2.address);

    const tx = await DDOS2.to(wallet2.address);
    const logs = await provider.getLogs(filter);
    const events = logs.map((log) => {
      let event = DDOS2Interface.parseLog(log);
      expect(event.args[0]).toBe(wallet1.address);
      expect(event.args[1]).toBe(wallet2.address);
      expect(event.args[2].toString()).toBe('1');
    })
  });

  test("check balance in DDOS2 is 1000000000000000000000", async () => {
    const DDOS2Balance = await DDOS2.balanceOf(wallet1.address);
    expect(DDOS2Balance.toString()).toBe("1000000000000000000000");
  });

  test("transfer can mint chi and emit Transfer, toOwner can transfer chi to owner", async () => {
    let filter = DDOS2.filters.Transfer(null, wallet2.address);

    // transfer
    const tx = await DDOS2.transfer(wallet2.address, 10);
    // const estimateGas = await provider.estimateGas(tx);
    // console.log(estimateGas);
    const logs = await provider.getLogs(filter);
    const events = logs.map((log) => {
      const event = DDOS2Interface.parseLog(log);
      expect(event.args[0]).toBe(wallet1.address);
      expect(event.args[1]).toBe(wallet2.address);
      expect(event.args[2].toString()).toBe('10');
    })

    // chi on contract
    const chiBalance = await chi.balanceOf(DDOS2Artifact.networks[1].address);
    expect(chiBalance.toString()).toBe("10");

    // transfer chi to owner
    let wallet2Balance = await chi.balanceOf(wallet2.address);
    expect(wallet2Balance.toString()).toBe("0");
    await DDOS2.toOwner(1);
    wallet2Balance = await chi.balanceOf(wallet2.address);
    expect(wallet2Balance.toString()).toBe("1");
  })
});
