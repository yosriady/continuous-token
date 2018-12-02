pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "../math/BancorFormula.sol";
import "../lib/ValidGasPrice.sol";


contract ContinuousToken is BancorFormula, ValidGasPrice, ERC20, ERC20Detailed {
    using SafeMath for uint;

    uint public decimals = 10**18;
    uint public reserveBalance; // Reserve balance in Ether

    /*
        reserve ratio, represented in ppm, 1-1000000
        1/3 corresponds to y= multiple * x^2
        1/2 corresponds to y= multiple * x
        2/3 corresponds to y= multiple * x^1/2
    */
    uint32 public reserveRatio;

    event ContinuousMint(address sender, uint amount, uint deposit);
    event ContinuousBurn(address sender, uint amount, uint reimbursement);

    constructor(
        string _name,
        string _symbol,
        uint8 _decimals,
        uint32 _reserveRatio
    ) public ERC20Detailed(_name, _symbol, _decimals) {
        reserveRatio = _reserveRatio;
    }

    function calculateContinuousMintReturn(uint _amount) public view returns (uint mintAmount) {
        return calculatePurchaseReturn(totalSupply(), reserveBalance, reserveRatio, _amount);
    }

    function calculateContinuousBurnReturn(uint _amount) public view returns (uint burnAmount) {
        return calculateSaleReturn(totalSupply(), reserveBalance, reserveRatio, _amount);
    }

    function _continuousMint(uint _deposit) internal validGasPrice returns (uint) {
        require(_deposit > 0, "Deposit must be non-zero.");

        uint amount = calculateContinuousMintReturn(_deposit);
        _mint(msg.sender, amount);
        reserveBalance = reserveBalance.add(_deposit);
        emit ContinuousMint(msg.sender, amount, _deposit);
        return amount;
    }

    function _continuousBurn(uint _amount) internal validGasPrice returns (uint) {
        require(_amount > 0, "Amount must be non-zero.");
        require(balanceOf(msg.sender) >= _amount, "Insufficient tokens to burn.");

        uint reimburseAmount = calculateContinuousBurnReturn(_amount);
        reserveBalance = reserveBalance.sub(reimburseAmount);
        _burn(msg.sender, _amount);
        emit ContinuousBurn(msg.sender, _amount, reimburseAmount);
        return reimburseAmount;
    }
}