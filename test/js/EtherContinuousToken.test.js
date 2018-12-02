const EtherContinuousToken = artifacts.require('EtherContinuousToken');

const DECIMALS = 18;
const INITIAL_SUPPLY = web3.utils.toWei('1', 'ether');
const RESERVE_RATIO = 500000; // 1/2 reserve ratio

contract('EtherContinuousToken', ([owner]) => {
  before(async () => {
    this.token = await EtherContinuousToken.new('Gyld Token', 'GYL', DECIMALS, INITIAL_SUPPLY, RESERVE_RATIO);
  });

  it('initialized correctly', async () => {
    const tokenOwner = await this.token.owner();
    assert.equal(tokenOwner, owner);

    const totalSupply = await this.token.totalSupply();
    assert.equal(totalSupply.toNumber(), 0);
  });
});
