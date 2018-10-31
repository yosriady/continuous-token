// Helper for deploying upgradable contracts
module.exports = async (deployer, proxyContract, contract) => {
  const implementation = await deployer.deploy(contract);
  const proxy = await deployer.deploy(proxyContract);
  await proxy.upgradeTo(implementation.address);
  const upgradable = await contract.at(proxy.address);
  return {
    proxy,
    implementation: upgradable,
  };
};
