const MyDapp = artifacts.require("DDOS2");

module.exports = function (deployer) {
  deployer.deploy(MyDapp);
};
