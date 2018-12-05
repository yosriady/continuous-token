// TODO: test with ERC20Continuous Tokens
// Reserve ratios: 0.5, 0.75, 0.9
// https://github.com/oceanprotocol/bondingCurvesUX/tree/master/contract


const TestERC20Token = artifacts.require('TestERC20Token.sol');
const ERC20ContinuousToken = artifacts.require('ERC20ContinuousToken.sol');

const DECIMALS = 18;
const ONE_TOKEN = web3.utils.toWei('1', 'ether');
const LOTS_OF_TOKENS = web3.utils.toWei('100', 'ether');
const INITIAL_SUPPLY = ONE_TOKEN;
const INITIAL_RESERVE = ONE_TOKEN;
const TEST_RESERVE_RATIO_50 = 500000; // 1/2 reserve ratio
// const TEST_RESERVE_RATIO_75 = 750000; // 3/4 reserve ratio
// const TEST_RESERVE_RATIO_90 = 900000; // 9/10 reserve ratio

contract('0.5 Reserve Ratio', ([owner, A]) => {
  before(async () => {
    this.reserveToken = await TestERC20Token.new();
    await this.reserveToken.mint(owner, LOTS_OF_TOKENS);

    this.continuousToken = await ERC20ContinuousToken.new(
      'Gyld Token',
      'GYL',
      DECIMALS,
      INITIAL_SUPPLY,
      TEST_RESERVE_RATIO_50,
      this.reserveToken.address,
    );
    // Mint reserve tokens to CT
    await this.reserveToken.transfer(
      this.continuousToken.address,
      INITIAL_RESERVE,
      { from: owner },
    );

    // User reserve token balances
    await this.reserveToken.mint(A, LOTS_OF_TOKENS);
  });

  it('initialized correctly', async () => {
    const tokenOwner = await this.continuousToken.owner();
    assert.equal(tokenOwner, owner);

    const totalSupply = await this.continuousToken.totalSupply();
    assert.equal(totalSupply, INITIAL_SUPPLY);

    const reserveRatio = await this.continuousToken.reserveRatio();
    assert.equal(reserveRatio, TEST_RESERVE_RATIO_50);

    const reserveBalance = await this.continuousToken.reserveBalance();
    assert.equal(reserveBalance, ONE_TOKEN);
  });
});
