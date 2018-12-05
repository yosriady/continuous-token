const { assertEvent } = require('../helpers');

const TestERC20Token = artifacts.require('TestERC20Token.sol');
const ERC20ContinuousToken = artifacts.require('ERC20ContinuousToken.sol');

const DECIMALS = 18;
const ONE_TOKEN = web3.utils.toWei('1', 'ether');
const LOTS_OF_TOKENS = web3.utils.toWei('100', 'ether');
const INITIAL_SUPPLY = ONE_TOKEN;
const INITIAL_RESERVE = ONE_TOKEN;
const RESERVE_RATIO = 500000; // 1/2 reserve ratio

contract('ERC20ContinuousToken', ([owner, A]) => {
  before(async () => {
    this.reserveToken = await TestERC20Token.new();
    await this.reserveToken.mint(owner, LOTS_OF_TOKENS);

    this.continuousToken = await ERC20ContinuousToken.new(
      'Gyld Token',
      'GYL',
      DECIMALS,
      INITIAL_SUPPLY,
      RESERVE_RATIO,
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
    assert.equal(reserveRatio, RESERVE_RATIO);

    const reserveBalance = await this.continuousToken.reserveBalance();
    assert.equal(reserveBalance, ONE_TOKEN);
  });

  it('should mint continuous tokens when given reserve tokens', async () => {
    const oldBalance = await this.continuousToken.balanceOf(A);
    assert.equal(oldBalance.toString(), '0');

    const depositAmount = ONE_TOKEN;
    const rewardAmount = await this.continuousToken.getContinuousMintReward(depositAmount);
    assert.equal(rewardAmount.toString(), '414213562373095048'); // 0.4 CT

    await this.reserveToken.approve(this.continuousToken.address, depositAmount, { from: A });
    const result = await this.continuousToken.mint(depositAmount, { from: A });

    assertEvent(result, 1, {
      event: 'Minted',
      args: {
        sender: A,
        amount: rewardAmount,
        deposit: depositAmount,
      },
    }, 'A Minted event is emitted');

    const reserveBalance = await this.continuousToken.reserveBalance();
    assert.equal(reserveBalance, web3.utils.toWei('2', 'ether')); // 2 RT

    const newBalance = await this.continuousToken.balanceOf(A);
    assert.equal(newBalance.toString(), rewardAmount.toString());
  });

  it('should refund reserve tokens when burned', async () => {
    const oldBalance = await this.continuousToken.balanceOf(A);
    assert.equal(oldBalance.toString(), '414213562373095048'); // 0.4 CT

    const burnAmount = oldBalance;
    const refundAmount = await this.continuousToken.getContinuousBurnRefund(burnAmount);
    assert.equal(refundAmount.toString(), '999999999999999998'); // ~1 RT

    const result = await this.continuousToken.burn(burnAmount, { from: A });
    assertEvent(result, 1, {
      event: 'Burned',
      args: {
        sender: A,
        amount: burnAmount,
        refund: refundAmount,
      },
    }, 'A Burned event is emitted');

    const newBalance = await this.continuousToken.balanceOf(A);
    assert.equal(newBalance.toString(), '0');

    const reserveBalance = await this.continuousToken.reserveBalance();
    assert.equal(reserveBalance.toString(), '1000000000000000002'); // 2 - 0.9999 = ~1 RT
  });
});
