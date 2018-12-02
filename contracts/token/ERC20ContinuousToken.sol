pragma solidity 0.4.25;

import "./ContinuousToken.sol";


contract ERC20ContinuousToken is ContinuousToken {
    ERC20 public reserveToken;

    constructor(
        string _name,
        string _symbol,
        uint8 _decimals,
        uint _initialSupply,
        uint32 _reserveRatio,
        ERC20 _reserveToken
    ) public ContinuousToken(_name, _symbol, _decimals, _initialSupply, _reserveRatio) {
        reserveToken = _reserveToken;
    }

    function () public { revert("Cannot call fallback function."); }

    function mint(uint _amount) public {
        require(reserveToken.transferFrom(msg.sender, address(this), _amount), "ERC20.transferFrom failed.");
        _continuousMint(_amount);
    }

    function burn(uint _amount) public {
        uint returnAmount = _continuousBurn(_amount);
        reserveToken.transfer(msg.sender, returnAmount);
    }

    function reserveBalance() public view returns (uint) {
        return reserveToken.balanceOf(address(this));
    }    
}