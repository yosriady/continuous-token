const ContinuousToken = artifacts.require('ContinuousToken.sol');

module.exports = async (deployer) => {
  await deployer.deploy(ContinuousToken, 500000, web3.utils.toWei('1', 'ether'));
};
