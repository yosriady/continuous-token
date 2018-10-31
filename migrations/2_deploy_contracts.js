const MyToken = artifacts.require('MyToken.sol');

module.exports = async (deployer) => {
  await deployer.deploy(MyToken);
};
