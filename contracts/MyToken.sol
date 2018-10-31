pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";


contract MyToken is ERC20Mintable {
    string public name = "MyToken";
    string public symbol = "MYT";
    uint public decimals = 18;
}