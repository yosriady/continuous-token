pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "../math/BancorFormula.sol";
import "../lib/ValidGasPrice.sol";


contract ContinuousToken is ValidGasPrice, BancorFormula, ERC20, ERC20Detailed {
    using SafeMath for uint;

    /*
        reserve ratio, represented in ppm, 1-1000000
        1/3 corresponds to y= multiple * x^2
        1/2 corresponds to y= multiple * x
        2/3 corresponds to y= multiple * x^1/2
    */
    uint32 public reserveRatio;

    event Minted(address sender, uint amount, uint deposit);
    event Burned(address sender, uint amount, uint refund);

    constructor(
        string _name,
        string _symbol,
        uint8 _decimals,
        uint _initialSupply,
        uint32 _reserveRatio
    ) public ERC20Detailed(_name, _symbol, _decimals) {
        reserveRatio = _reserveRatio;
        _mint(msg.sender, _initialSupply);
    }

    function getContinuousMintReward(uint _reserveTokenAmount) public view returns (uint) {
        return calculatePurchaseReturn(totalSupply(), reserveBalance(), reserveRatio, _reserveTokenAmount);
    }

    function getContinuousBurnRefund(uint _continuousTokenAmount) public view returns (uint) {
        return calculateSaleReturn(totalSupply(), reserveBalance(), reserveRatio, _continuousTokenAmount);
    }

    /**
    * @dev Abstract method that returns reserve balance
    */
    function reserveBalance() public view returns (uint);

    function _continuousMint(uint _deposit) internal validGasPrice returns (uint) {
        require(_deposit > 0, "Deposit must be non-zero.");

        uint rewardAmount = getContinuousMintReward(_deposit);
        _mint(msg.sender, rewardAmount);
        emit Minted(msg.sender, rewardAmount, _deposit);
        return rewardAmount;
    }

    function _continuousBurn(uint _amount) internal validGasPrice returns (uint) {
        require(_amount > 0, "Amount must be non-zero.");
        require(balanceOf(msg.sender) >= _amount, "Insufficient tokens to burn.");

        uint refundAmount = getContinuousBurnRefund(_amount);
        _burn(msg.sender, _amount);
        emit Burned(msg.sender, _amount, refundAmount);
        return refundAmount;
    }
}