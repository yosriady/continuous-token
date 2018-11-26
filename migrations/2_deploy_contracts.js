const Continuous = artifacts.require('Continuous.sol');

module.exports = async (deployer) => {
  await deployer.deploy(Continuous);
};
