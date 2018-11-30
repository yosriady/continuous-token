pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./math/BancorFormula.sol";


contract ContinuousToken is BancorFormula, Ownable, ERC20 {
    using SafeMath for uint256;

    uint256 public scale = 10**18;
    uint256 public reserveBalance = 10*scale;

    /*
        reserve ratio, represented in ppm, 1-1000000
        1/3 corresponds to y= multiple * x^2
        1/2 corresponds to y= multiple * x
        2/3 corresponds to y= multiple * x^1/2
    */    
    uint32 public reserveRatio;

    event ContinuousMint(address sender, uint256 amount, uint256 deposit);
    event ContinuousBurn(address sender, uint256 amount, uint256 reimbursement);

    // TODO: max gas price check to prevent front-running
    constructor(
        uint32 _reserveRatio,
        uint256 _initialSupply
    ) public {
        reserveRatio = _reserveRatio;
        _mint(msg.sender, _initialSupply);
    }

    function () public payable { mint(); }

    function mint() public payable {
        require(msg.value > 0, "Must send ether to buy tokens.");
        _continuousMint(msg.value);
    }

    function burn(uint256 _amount) public {
        uint256 returnAmount = _continuousBurn(_amount);
        msg.sender.transfer(returnAmount);
    }

    function calculateContinuousMintReturn(uint256 _amount)
        public view returns (uint256 mintAmount)
    {
        return calculatePurchaseReturn(totalSupply(), reserveBalance, reserveRatio, _amount);
    }

    function calculateContinuousBurnReturn(uint256 _amount)
        public view returns (uint256 burnAmount)
    {
        return calculateSaleReturn(totalSupply(), reserveBalance, reserveRatio, _amount);
    }

    function _continuousMint(uint256 _deposit)
        internal returns (uint256)
    {
        require(_deposit > 0, "Deposit must be non-zero.");

        uint256 amount = calculateContinuousMintReturn(_deposit);
        _mint(msg.sender, amount);
        reserveBalance = reserveBalance.add(_deposit);
        emit ContinuousMint(msg.sender, amount, _deposit);
        return amount;
    }

    function _continuousBurn(uint256 _amount)
        internal returns (uint256)
    {
        require(_amount > 0, "Amount must be non-zero.");
        require(balanceOf(msg.sender) >= _amount, "Insufficient tokens to burn.");

        uint256 reimburseAmount = calculateContinuousBurnReturn(_amount);
        reserveBalance = reserveBalance.sub(reimburseAmount);
        _burn(msg.sender, _amount);
        emit ContinuousBurn(msg.sender, _amount, reimburseAmount);
        return reimburseAmount;
    }
}