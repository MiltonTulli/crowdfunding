var CrowdFunding = artifacts.require("./CrowdFunding.sol");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(CrowdFunding, "Test campaign", 10, 99999999, accounts[3]);
};
