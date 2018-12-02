const EtherContinuousToken = artifacts.require('EtherContinuousToken.sol');

const DECIMALS = 18;
const INITIAL_SUPPLY = web3.utils.toWei('1', 'ether');
const RESERVE_RATIO = 500000;

module.exports = async (deployer) => {
  await deployer.deploy(EtherContinuousToken, 'Gyld Token', 'GYL', DECIMALS, INITIAL_SUPPLY, RESERVE_RATIO);
};
