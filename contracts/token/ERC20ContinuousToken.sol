pragma solidity 0.4.25;

import "./BancorContinuousToken.sol";


contract ERC20ContinuousToken is BancorContinuousToken {
    ERC20 public reserveToken;

    constructor(
        string _name,
        string _symbol,
        uint8 _decimals,
        uint _initialSupply,
        uint32 _reserveRatio,
        ERC20 _reserveToken
    ) public BancorContinuousToken(_name, _symbol, _decimals, _initialSupply, _reserveRatio) {
        reserveToken = _reserveToken;
    }

    function () public { revert("Cannot call fallback function."); }

    function mint(uint _amount) public {
        _continuousMint(_amount);
        require(reserveToken.transferFrom(msg.sender, address(this), _amount), "ERC20.transferFrom failed.");
    }

    function burn(uint _amount) public {
        uint returnAmount = _continuousBurn(_amount);
        require(reserveToken.transfer(msg.sender, returnAmount), "ERC20.transfer failed.");
    }

    function reserveBalance() public view returns (uint) {
        return reserveToken.balanceOf(address(this));
    }    
}