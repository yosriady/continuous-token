pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract ValidGasPrice is Ownable {
    uint256 public maxGasPrice = 1 * 10**18;

    modifier validGasPrice() {
        require(tx.gasprice <= maxGasPrice, "Gas price must be <= maximum gas price to prevent front running attacks.");
        _;
    }

    function setMaxGasPrice(uint256 newPrice) public onlyOwner {
        maxGasPrice = newPrice;
    }
}