pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./math/BancorFormula.sol";
import "./lib/ValidGasPrice.sol";


contract ContinuousToken is BancorFormula, ValidGasPrice, Ownable, ERC20Detailed {
    using SafeMath for uint256;

    uint256 public decimals = 10**18;
    uint256 public reserveBalance; // Reserve balance in Ether

    /*
        reserve ratio, represented in ppm, 1-1000000
        1/3 corresponds to y= multiple * x^2
        1/2 corresponds to y= multiple * x
        2/3 corresponds to y= multiple * x^1/2
    */
    uint32 public reserveRatio;

    event ContinuousMint(address sender, uint256 amount, uint256 deposit);
    event ContinuousBurn(address sender, uint256 amount, uint256 reimbursement);

    constructor(
        string _name,
        string _symbol,
        uint32 _reserveRatio
    ) public ERC20Detailed(_name, _symbol, 18) {
        reserveRatio = _reserveRatio;
    }

    function calculateContinuousMintReturn(uint256 _amount) public view returns (uint256 mintAmount) {
        return calculatePurchaseReturn(totalSupply(), reserveBalance, reserveRatio, _amount);
    }

    function calculateContinuousBurnReturn(uint256 _amount) public view returns (uint256 burnAmount) {
        return calculateSaleReturn(totalSupply(), reserveBalance, reserveRatio, _amount);
    }

    function _continuousMint(uint256 _deposit) internal validGasPrice returns (uint256) {
        require(_deposit > 0, "Deposit must be non-zero.");

        uint256 amount = calculateContinuousMintReturn(_deposit);
        _mint(msg.sender, amount);
        reserveBalance = reserveBalance.add(_deposit);
        emit ContinuousMint(msg.sender, amount, _deposit);
        return amount;
    }

    function _continuousBurn(uint256 _amount) internal validGasPrice returns (uint256) {
        require(_amount > 0, "Amount must be non-zero.");
        require(balanceOf(msg.sender) >= _amount, "Insufficient tokens to burn.");

        uint256 reimburseAmount = calculateContinuousBurnReturn(_amount);
        reserveBalance = reserveBalance.sub(reimburseAmount);
        _burn(msg.sender, _amount);
        emit ContinuousBurn(msg.sender, _amount, reimburseAmount);
        return reimburseAmount;
    }
}