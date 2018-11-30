pragma solidity 0.4.25;

import "./ContinuousToken.sol";


contract EtherContinuousToken is ContinuousToken {
    constructor(
        string _name,
        string _symbol,
        uint32 _reserveRatio
    ) public ContinuousToken(_name, _symbol, _reserveRatio) {}

    function () public payable { mint(); }

    function mint() public payable {
        require(msg.value > 0, "Must send ether to buy tokens.");
        _continuousMint(msg.value);
    }

    function burn(uint256 _amount) public {
        uint256 returnAmount = _continuousBurn(_amount);
        msg.sender.transfer(returnAmount);
    }
}