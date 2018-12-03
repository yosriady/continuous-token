pragma solidity 0.4.25;

import "./BancorContinuousToken.sol";


contract ETHContinuousToken is BancorContinuousToken {
    uint256 internal _reserveBalance;
  
    constructor(
        string _name,
        string _symbol,
        uint8 _decimals,
        uint _initialSupply,
        uint32 _reserveRatio
    ) public payable BancorContinuousToken(_name, _symbol, _decimals, _initialSupply, _reserveRatio) {
        _reserveBalance = msg.value;
    }

    function () public payable { mint(); }

    function mint() public payable {
        uint purchaseAmount = msg.value;
        _continuousMint(purchaseAmount);
        _reserveBalance = _reserveBalance.add(purchaseAmount);
    }

    function burn(uint _amount) public {
        uint refundAmount = _continuousBurn(_amount);
        _reserveBalance = _reserveBalance.sub(refundAmount);
        msg.sender.transfer(refundAmount);
    }

    function reserveBalance() public view returns (uint) {
        return _reserveBalance;
    }    
}