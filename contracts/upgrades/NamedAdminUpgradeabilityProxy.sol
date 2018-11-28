pragma solidity 0.4.25;

import "./AdminUpgradeabilityProxy.sol";


/**
 * @title NamedAdminUpgradeabilityProxy
 * @dev This contract adds additional metadata to an admin upgradeability proxy.
 * This is needed for frontend Drizzle integration, which doesn't support duplicate contract artifacts.
 */
contract NamedAdminUpgradeabilityProxy is AdminUpgradeabilityProxy {
    /**
    * @dev Storage slot with the name of the proxy contract.
    * This is the keccak-256 hash of "org.tenx.proxy.name", and is
    * validated in the constructor.
    */
    bytes32 private constant NAME_SLOT = 0x5f09409c24f8fd717acbee9b80178433d2d594c78350faa9c216e8a4f31442a0;

    /**
    * Contract constructor.
    * It sets the `msg.sender` as the proxy administrator.
    * @param _implementation address of the initial implementation.
    * @param _name name of the proxy contract.
    */
    constructor(string _name, address _implementation) public AdminUpgradeabilityProxy(_implementation) payable {
        assert(NAME_SLOT == keccak256("org.tenx.proxy.name"));
        _setName(_name);        
    }

    /**
    * @return The string of the proxy name.
    */
    function name() external view ifAdmin returns (string) {
        return _name();
    }    

    /**
    * @return The admin slot.
    */
    function _name() internal view returns (string nm) {
        bytes32 slot = NAME_SLOT;
        assembly {
            nm := sload(slot)
        }
    }

    /**
    * @dev Sets the name of the proxy contract.
    * @param newName Name of the proxy contract.
    */
    function _setName(string newName) internal {
        bytes32 slot = NAME_SLOT;

        assembly {
            sstore(slot, newName)
        }
    }
}
