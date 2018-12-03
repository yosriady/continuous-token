// const { assertEvent } = require('../helpers');

const TestERC20Token = artifacts.require('TestERC20Token.sol');
const ERC20ContinuousToken = artifacts.require('ERC20ContinuousToken.sol');

const DECIMALS = 18;
const ONE_TOKEN = web3.utils.toWei('1', 'ether');
const INITIAL_SUPPLY = ONE_TOKEN;
const RESERVE_RATIO = 500000; // 1/2 reserve ratio

contract('ERC20ContinuousToken', ([owner]) => {
  before(async () => {
    this.reserveToken = await TestERC20Token.new();
    this.continuousToken = await ERC20ContinuousToken.new(
      'Gyld Token',
      'GYL',
      DECIMALS,
      INITIAL_SUPPLY,
      RESERVE_RATIO,
      this.reserveToken.address,
    );
    // Mint reserve tokens to CT
    await this.reserveToken.mint(this.continuousToken.address, ONE_TOKEN);
  });

  it('initialized correctly', async () => {
    const tokenOwner = await this.continuousToken.owner();
    assert.equal(tokenOwner, owner);

    const totalSupply = await this.continuousToken.totalSupply();
    assert.equal(totalSupply, INITIAL_SUPPLY);

    const reserveRatio = await this.continuousToken.reserveRatio();
    assert.equal(reserveRatio, RESERVE_RATIO);

    const reserveBalance = await this.continuousToken.reserveBalance();
    assert.equal(reserveBalance, ONE_TOKEN);
  });
});
