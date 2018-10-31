// const BN = require('bn.js');
// const { assertEvent, expectThrow, upgradable } = require('../helpers');

const MyToken = artifacts.require('MyToken');

contract('MyToken', ([, other]) => {
  before(async () => {
    this.token = await MyToken.new();
  });

  it('other accounts should be able to view token name', async () => {
    const name = await this.token.name({ from: other });
    assert.equal(name, 'MyToken');
  });

  it('other accounts should be able to view token symbol', async () => {
    const symbol = await this.token.symbol({ from: other });
    assert.equal(symbol, 'MYT');
  });

  it('other accounts hould be able to view token decimals', async () => {
    const decimals = await this.token.decimals({ from: other });
    assert.equal(decimals, 18);
  });
});
