// const BN = require('bn.js');

const ContinuousToken = artifacts.require('ContinuousToken');

const DECIMALS = 18;
const RESERVE_RATIO = 500000; // 1/2 reserve ratio
// const RESERVE_TOKEN_DEPOSIT_AMOUNT = web3.utils.toWei('1', 'ether');

contract('ContinuousToken', ([owner]) => {
  before(async () => {
    this.token = await ContinuousToken.new('Gyld Token', 'GYL', DECIMALS, RESERVE_RATIO);
  });

  it('initialized correctly', async () => {
    const tokenOwner = await this.token.owner();
    assert.equal(tokenOwner, owner);

    const totalSupply = await this.token.totalSupply();
    assert.equal(totalSupply.toNumber(), 0);
  });

  // it('', async () => {

  // });
});