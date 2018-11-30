const BN = require('bn.js');

const BancorFormula = artifacts.require('BancorFormula');

const CONTINUOUS_TOKEN_SUPPLY = web3.utils.toWei('2', 'ether');
const RESERVE_TOKEN_BALANCE = web3.utils.toWei('0.5', 'ether');
const RESERVE_RATIO = 500000; // 1/2 reserve ratio
const RESERVE_TOKEN_DEPOSIT_AMOUNT = web3.utils.toWei('1', 'ether');

contract('BancorFormula', () => {
  before(async () => {
    this.formula = await BancorFormula.new();
  });

  it('calculates purchase return', async () => {
    const buyAmount = await this.formula.calculatePurchaseReturn(
      CONTINUOUS_TOKEN_SUPPLY,
      RESERVE_TOKEN_BALANCE,
      RESERVE_RATIO,
      RESERVE_TOKEN_DEPOSIT_AMOUNT,
    );

    assert.equal(buyAmount.toString(), '1464101615137754587'); // ~1.46

    const newSupply = new BN(CONTINUOUS_TOKEN_SUPPLY).add(new BN(buyAmount));
    const newReserveBalance = new BN(RESERVE_TOKEN_BALANCE)
      .add(new BN(RESERVE_TOKEN_DEPOSIT_AMOUNT));
    const sellAmount = await this.formula.calculateSaleReturn(
      newSupply,
      newReserveBalance,
      RESERVE_RATIO,
      buyAmount,
    );
5
    assert.equal(sellAmount.toString(), '999999999999999999'); // ~1*10^18
  });
});
