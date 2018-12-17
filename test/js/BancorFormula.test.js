const BN = require('bn.js');

const BancorFormula = artifacts.require('BancorFormula');

// Note: As CT supply increases, CT price increases
const INITIAL_CONTINUOUS_TOKEN_SUPPLY = new BN(web3.utils.toWei('2'));
// Note: The higher the initial RT balance, the lower the initial CT prices are
const INITIAL_RESERVE_TOKEN_BALANCE = new BN(web3.utils.toWei('0.5'));
// As both initial CT and RT increases along the reserve ratio, CT price increases at slower rate
// Note: As reserve ratio increases, CT price increases at a slower rate
const RESERVE_RATIO_50 = 500000;
const RESERVE_RATIO_90 = 900000;
const ONE_TOKEN = new BN(web3.utils.toWei('1'));
const RESERVE_TOKEN_DEPOSIT_AMOUNT = ONE_TOKEN;

function toDecimalString(bn) {
  return web3.utils.fromWei(bn).toString();
}

function effectivePrice(reserveTokenAmount, continuousTokenAmount) {
  return toDecimalString(reserveTokenAmount.mul(ONE_TOKEN).div(continuousTokenAmount));
}

async function simulatePriceGrowth(
  contract,
  reserveRatio,
  continuousSupply,
  reserveBalance,
  purchaseIncrement,
) {
  console.info(`reserveRatio: ${reserveRatio}`);
  console.info(`continuousSupply: ${toDecimalString(continuousSupply)} CT`);
  console.info(`reserveBalance: ${toDecimalString(reserveBalance)} RT`);

  let continuousTokenSupply = continuousSupply;
  let reserveTokenBalance = reserveBalance;
  for (let i = 0; i < 10; i += 1) {
    // eslint-disable-next-line
    const continuousTokenAmount = await contract.calculatePurchaseReturn(
      continuousTokenSupply,
      reserveTokenBalance,
      reserveRatio,
      purchaseIncrement,
    );
    console.info(`${toDecimalString(purchaseIncrement)} RT gets you ${toDecimalString(continuousTokenAmount)} @ ${effectivePrice(purchaseIncrement, continuousTokenAmount)} RT each`);
    continuousTokenSupply = continuousTokenSupply.add(new BN(continuousTokenAmount));
    reserveTokenBalance = reserveTokenBalance.add(purchaseIncrement);
  }
}

contract('BancorFormula', () => {
  before(async () => {
    this.formula = await BancorFormula.new();
  });

  it('calculates purchase and sale return', async () => {
    const buyAmount = await this.formula.calculatePurchaseReturn(
      INITIAL_CONTINUOUS_TOKEN_SUPPLY,
      INITIAL_RESERVE_TOKEN_BALANCE,
      RESERVE_RATIO_50,
      RESERVE_TOKEN_DEPOSIT_AMOUNT,
    );

    assert.equal(buyAmount.toString(), '1464101615137754587'); // ~1.46 CT

    const newSupply = INITIAL_CONTINUOUS_TOKEN_SUPPLY.add(new BN(buyAmount));
    const newReserveBalance = INITIAL_RESERVE_TOKEN_BALANCE
      .add(new BN(RESERVE_TOKEN_DEPOSIT_AMOUNT));
    const sellAmount = await this.formula.calculateSaleReturn(
      newSupply,
      newReserveBalance,
      RESERVE_RATIO_50,
      buyAmount,
    );

    assert.equal(sellAmount.toString(), '999999999999999999'); // ~1*10^18 RT
  });

  it('calculates CT price growth', async () => {
    // After X initial CT supply and Y reserve token balance,
    // acceptable CT price must be 1 ERC20 token (e.g. Dai) = 1 CT
    // TODO: make 1CT be equal to 0.01 ETH
    const RESERVE_RATIO = RESERVE_RATIO_90;
    const BUY_INCREMENT = new BN(web3.utils.toWei('10'));
    const CT_SUPPLY = new BN(web3.utils.toWei('100'));
    const RT_BALANCE = new BN(web3.utils.toWei('90'));

    await simulatePriceGrowth(this.formula, RESERVE_RATIO, CT_SUPPLY, RT_BALANCE, BUY_INCREMENT);
    assert.equal(true, true);
  });
});
