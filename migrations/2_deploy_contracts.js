const ContinuousToken = artifacts.require('ContinuousToken.sol');

const DECIMALS = 18;
const RESERVE_RATIO = 500000;

module.exports = async (deployer) => {
  await deployer.deploy(ContinuousToken, 'Gyld Token', 'GYL', DECIMALS, RESERVE_RATIO);
};
