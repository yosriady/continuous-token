const { assertEvent } = require('../helpers');

const ETHContinuousToken = artifacts.require('ETHContinuousToken.sol');

const DECIMALS = 18;
const ONE_ETHER = web3.utils.toWei('1', 'ether');
const INITIAL_SUPPLY = ONE_ETHER;
const RESERVE_RATIO = 500000; // 1/2 reserve ratio

contract('ETHContinuousToken', ([owner, A]) => {
  before(async () => {
    this.token = await ETHContinuousToken.new(
      'Gyld Token',
      'GYL',
      DECIMALS,
      INITIAL_SUPPLY,
      RESERVE_RATIO,
      { value: ONE_ETHER },
    );
  });

  it('initialized correctly', async () => {
    const tokenOwner = await this.token.owner();
    assert.equal(tokenOwner, owner);

    const totalSupply = await this.token.totalSupply();
    assert.equal(totalSupply, INITIAL_SUPPLY);

    const reserveRatio = await this.token.reserveRatio();
    assert.equal(reserveRatio, RESERVE_RATIO);

    const reserveBalance = await this.token.reserveBalance();
    assert.equal(reserveBalance, ONE_ETHER);
  });

  it('should mint when passed ether', async () => {
    const oldBalance = await this.token.balanceOf(A);
    assert.equal(oldBalance.toString(), '0');

    const depositAmount = ONE_ETHER;
    const rewardAmount = await this.token.getContinuousMintReward(depositAmount);
    assert.equal(rewardAmount.toString(), '414213562373095048'); // 0.4 CT

    const result = await this.token.mint({ from: A, value: depositAmount });
    assertEvent(result, 1, {
      event: 'Minted',
      args: {
        sender: A,
        amount: rewardAmount,
        deposit: ONE_ETHER,
      },
    }, 'A Minted event is emitted');

    const newBalance = await this.token.balanceOf(A);
    assert.equal(newBalance.toString(), rewardAmount.toString());

    const reserveBalance = await this.token.reserveBalance();
    assert.equal(reserveBalance, web3.utils.toWei('2', 'ether'));
  });

  it('should refund ether when burned', async () => {
    const oldBalance = await this.token.balanceOf(A);
    assert.equal(oldBalance.toString(), '414213562373095048'); // 0.4 CT

    const burnAmount = oldBalance;
    const refundAmount = await this.token.getContinuousBurnRefund(burnAmount);
    assert.equal(refundAmount.toString(), '999999999999999998'); // ~1 ETH

    const result = await this.token.burn(burnAmount, { from: A });
    assertEvent(result, 1, {
      event: 'Burned',
      args: {
        sender: A,
        amount: burnAmount,
        refund: refundAmount,
      },
    }, 'A Burned event is emitted');

    const newBalance = await this.token.balanceOf(A);
    assert.equal(newBalance.toString(), '0');

    const reserveBalance = await this.token.reserveBalance();
    assert.equal(reserveBalance.toString(), '1000000000000000002'); // 2 - 0.9999 = ~1 ETH
  });
});
