pragma solidity 0.4.25;

import "./ContinuousToken.sol";


contract ETHContinuousToken is ContinuousToken {
    uint256 internal reserve;
  
    constructor(
        string _name,
        string _symbol,
        uint8 _decimals,
        uint _initialSupply,
        uint32 _reserveRatio
    ) public payable ContinuousToken(_name, _symbol, _decimals, _initialSupply, _reserveRatio) {
        reserve = msg.value;
    }

    function () public payable { mint(); }

    function mint() public payable {
        uint purchaseAmount = msg.value;
        _continuousMint(purchaseAmount);
        reserve = reserve.add(purchaseAmount);
    }

    function burn(uint _amount) public {
        uint refundAmount = _continuousBurn(_amount);
        reserve = reserve.sub(refundAmount);
        msg.sender.transfer(refundAmount);
    }

    function reserveBalance() public view returns (uint) {
        return reserve;
    }    
}