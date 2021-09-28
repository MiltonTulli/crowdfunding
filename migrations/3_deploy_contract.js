var CrowdFunding = artifacts.require("./CrowdFunding.sol");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(CrowdFunding, "Test campaign", 1, 20, accounts[0]);
};
