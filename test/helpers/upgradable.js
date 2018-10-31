module.exports = async (proxyContract, contract) => {
  const implementation = await contract.new();
  const proxy = await proxyContract.new();
  await proxy.upgradeTo(implementation.address);
  const upgradable = await contract.at(proxy.address);
  return {
    proxy,
    implementation: upgradable,
  };
};
