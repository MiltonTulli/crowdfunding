var CrowdFunding = artifacts.require("./CrowdFunding.sol");

module.exports = function (deployer, network, accounts) {
  let beneficiaryAdress;
  let creatorAcc;

  if (network === "ganache") {
    beneficiaryAdress = accounts[1];
    creatorAcc = accounts[0];
  } else {
    // TODO: check for specific network like rinkeby
    beneficiaryAdress = process.env.RINKEBY_BENEFICIARY_ACCOUNT;
    creatorAcc = process.env.RINKEBY_SENDER_ACCOUNT;
  }

  deployer.deploy(
    CrowdFunding,
    "Una vaquita para el manuel",
    12,
    525700,
    beneficiaryAdress,
    { from: creatorAcc }
  );
};
