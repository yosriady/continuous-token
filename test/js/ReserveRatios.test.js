// TODO: test with ERC20Continuous Tokens
// Reserve ratios: 0.5, 0.75, 0.9
// https://github.com/oceanprotocol/bondingCurvesUX/tree/master/contract


const TestERC20Token = artifacts.require('TestERC20Token.sol');
const ERC20ContinuousToken = artifacts.require('ERC20ContinuousToken.sol');

const DECIMALS = 18;
const ONE_TOKEN = web3.utils.toWei('1', 'ether');
const INITIAL_SUPPLY = ONE_TOKEN;
const TEST_RESERVE_RATIO_05 = 500000; // 1/2 reserve ratio

contract('0.5 Reserve Ratio', ([owner, A]) => {
  before(async () => {
    this.reserveToken = await TestERC20Token.new();
    this.continuousToken = await ERC20ContinuousToken.new(
      'Gyld Token',
      'GYL',
      DECIMALS,
      INITIAL_SUPPLY,
      TEST_RESERVE_RATIO_05,
      this.reserveToken.address,
    );
    // Mint reserve tokens to CT
    await this.reserveToken.mint(this.continuousToken.address, ONE_TOKEN);

    // User reserve token balances
    await this.reserveToken.mint(A, ONE_TOKEN);
  });

  it('initialized correctly', async () => {
    const tokenOwner = await this.continuousToken.owner();
    assert.equal(tokenOwner, owner);

    const totalSupply = await this.continuousToken.totalSupply();
    assert.equal(totalSupply, INITIAL_SUPPLY);

    const reserveRatio = await this.continuousToken.reserveRatio();
    assert.equal(reserveRatio, TEST_RESERVE_RATIO_05);

    const reserveBalance = await this.continuousToken.reserveBalance();
    assert.equal(reserveBalance, ONE_TOKEN);
  });
});
