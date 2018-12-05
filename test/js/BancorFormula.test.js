const BN = require('bn.js');

const BancorFormula = artifacts.require('BancorFormula');

// TODO: Need a 'golden mean' of initial CT supply and reserve token balance that leads to 
// an acceptable initial CT price.
// After X initial CT supply and Y reserve token balance, acceptable CT price must be 1 ERC20 token (e.g. Dai) = 1 CT
const CONTINUOUS_TOKEN_SUPPLY = web3.utils.toWei('2', 'ether'); // Note: As CT supply increases, CT price increases
const RESERVE_TOKEN_BALANCE = web3.utils.toWei('0.5', 'ether'); // Note: The higher the initial reserve balance, the cheaper the CT prices are
const RESERVE_RATIO_50 = 500000; // Note: As reserve ratio increases, CT price increases at a slower rate
const RESERVE_TOKEN_DEPOSIT_AMOUNT = web3.utils.toWei('1', 'ether');

contract('BancorFormula', () => {
  before(async () => {
    this.formula = await BancorFormula.new();
  });

  it('calculates purchase and sale return', async () => {
    const buyAmount = await this.formula.calculatePurchaseReturn(
      CONTINUOUS_TOKEN_SUPPLY,
      RESERVE_TOKEN_BALANCE,
      RESERVE_RATIO_50,
      RESERVE_TOKEN_DEPOSIT_AMOUNT,
    );

    assert.equal(buyAmount.toString(), '1464101615137754587'); // ~1.46

    const newSupply = new BN(CONTINUOUS_TOKEN_SUPPLY).add(new BN(buyAmount));
    const newReserveBalance = new BN(RESERVE_TOKEN_BALANCE)
      .add(new BN(RESERVE_TOKEN_DEPOSIT_AMOUNT));
    const sellAmount = await this.formula.calculateSaleReturn(
      newSupply,
      newReserveBalance,
      RESERVE_RATIO_50,
      buyAmount,
    );

    assert.equal(sellAmount.toString(), '999999999999999999'); // ~1*10^18
  });

  // TODO: test case of calculate in a loop, with different reserve ratios to see how the value grows
});
