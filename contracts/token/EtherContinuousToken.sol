pragma solidity 0.4.25;

import "./ContinuousToken.sol";


contract EtherContinuousToken is ContinuousToken {
    function () public payable { mint(); }

    function mint() public payable {
        require(msg.value > 0, "Must send ether to buy tokens.");
        _continuousMint(msg.value);
    }

    function burn(uint _amount) public {
        uint returnAmount = _continuousBurn(_amount);
        msg.sender.transfer(returnAmount);
    }
}