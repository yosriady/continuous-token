pragma solidity 0.4.25;

import "./ContinuousToken.sol";


// Need additional attributes for creator / caretaker address and fees
// TODO: Define ERC20ContinuousTokenWithFees
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
        // TODO: send X% of _amount to creatorAddress
        // TODO: send Y% of _amount to caretakerAddress
        // Need to be implemented in ContinuousToken._continuousMintWithFees()
        _continuousMint(_amount);
        require(reserveToken.transferFrom(msg.sender, address(this), _amount), "mint() ERC20.transferFrom failed.");
    }

    function burn(uint _amount) public {
        // TODO: send X% of _amount to creatorAddress
        // TODO: send Y% of _amount to caretakerAddress
        // Can  be implemented here with multiple reserveToken.transfer(creator / caretaker, splitAmount)
        uint returnAmount = _continuousBurn(_amount);
        require(reserveToken.transfer(msg.sender, returnAmount), "burn() ERC20.transfer failed.");
    }

    function reserveBalance() public view returns (uint) {
        return reserveToken.balanceOf(address(this));
    }
}