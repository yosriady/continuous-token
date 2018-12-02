const ETHContinuousToken = artifacts.require('ETHContinuousToken');

const DECIMALS = 18;
const ONE_ETHER = web3.utils.toWei('1', 'ether');
const INITIAL_SUPPLY = ONE_ETHER;
const RESERVE_RATIO = 500000; // 1/2 reserve ratio

contract('ETHContinuousToken', ([owner]) => {
  before(async () => {
    this.token = await ETHContinuousToken.new('Gyld Token', 'GYL', DECIMALS, INITIAL_SUPPLY, RESERVE_RATIO);
  });

  it('initialized correctly', async () => {
    const tokenOwner = await this.token.owner();
    assert.equal(tokenOwner, owner);

    const totalSupply = await this.token.totalSupply();
    assert.equal(totalSupply, INITIAL_SUPPLY);

    const reserveRatio = await this.token.reserveRatio();
    assert.equal(reserveRatio, RESERVE_RATIO);

    const reserveBalance = await this.token.reserveBalance();
    assert.equal(reserveBalance, 0);
  });

  // TODO: test mint, test burn
  it('should mint when passed ether', async () => {
    // const depositAmount = ONE_ETHER;
    // const result = await this.token.mint({ value: depositAmount });
    // await this.token.mint({ value: depositAmount });

    // TOFIX: failing with revert
    // const rewardAmount = await this.token.getContinuousMintReward(1);
    // assert.equal(rewardAmount.toString(), '');

    // console.log(result);
    // TODO: assert _continuousMint event and new balanceOf(owner)
    //     emit Minted(msg.sender, rewardAmount, _deposit);

    // const reserveBalance = await this.token.reserveBalance();
    // assert.equal(reserveBalance, ONE_ETHER);
  });
});
