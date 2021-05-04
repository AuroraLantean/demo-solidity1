// SPDX-License-Identifier: MIT
// AND GPL-3.0-or-later
pragma solidity 0.8.4;

contract Box {
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}

contract BoxV2 {
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }

    // Increments the stored value by 1
    function increment() public {
        value = value + 1;
        emit ValueChanged(value);
    }
}
/**
You can use your Solidity contracts with OpenZeppelin Upgrades without any modifications, except for their constructors. Due to a requirement of the proxy-based upgradeability system, no constructors can be used in upgradeable contracts. To learn about the reasons behind this restriction, head to Proxies.
https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#the-constructor-caveat

This means that, when using a contract with the OpenZeppelin Upgrades, you need to change its constructor into a regular function, typically named initialize, where you run all the setup logic.

To prevent a contract from being initialized multiple times, you need to add a check to ensure the initialize function is called only once:

Another difference between a constructor and a regular function is that Solidity takes care of automatically invoking the constructors of all ancestors of a contract. When writing an initializer, you need to take special care to manually call the initializers of all parent contracts:


  bool private initialized;
  function initialize(uint256 _x) public {
      require(!initialized, "Contract instance has already been initialized");
      initialized = true;
      x = _x;
  }
OR
  import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

  contract BaseContract is Initializable {
      uint256 public y;

      function initialize() public initializer {
          y = 42;
      }
  }

  contract MyContract is BaseContract {
      uint256 public x;

      function initialize(uint256 _x) public initializer {
          BaseContract.initialize(); // Do not forget this call!
          x = _x;
      }
  }

Using Upgradeable Smart Contract Libraries
... not only your contracts, but also the contracts you import from a library. Consider for example ERC20 from OpenZeppelin Contracts: the contract initializes the token’s name, symbol and decimals in its constructor.

This means you should not be using these contracts in your OpenZeppelin Upgrades project. Instead, make sure to use @openzeppelin/contracts-upgradeable, which is an official fork of OpenZeppelin Contracts that has been modified to use initializers instead of constructors. Take a look at what ERC20Upgradeable looks like in @openzeppelin/contracts-upgradeable:

// @openzeppelin/contracts-upgradeable/contracts/token/ERC20/ERC20Upgradeable.sol
pragma solidity ^0.6.0;
  ...
contract ERC20Upgradeable is Initializable, ContextUpgradeable, IERC20Upgradeable {
  ...
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    function __ERC20_init(string memory name, string memory symbol) internal initializer {
        __Context_init_unchained();
        __ERC20_init_unchained(name, symbol);
    }

    function __ERC20_init_unchained(string memory name, string memory symbol) internal initializer {
        _name = name;
        _symbol = symbol;
        _decimals = 18;
    }
  ...
}

Avoiding Initial Values in Field Declarations
Solidity allows defining initial values for fields when declaring them in a contract.

It is still ok to define constant state variables, because the compiler does not reserve a storage slot for these variables, and every occurrence is replaced by the respective constant expression. So the following still works with OpenZeppelin Upgrades:
contract MyContract {
    uint256 public constant hasInitialValue = 42; // define as constant
}

Creating New Instances From Your Contract Code
When creating a new instance of a contract from your contract’s code, these creations are handled directly by Solidity and not by OpenZeppelin Upgrades, which means that these contracts will not be upgradeable.


Potentially Unsafe Operations
When working with upgradeable smart contracts, you will always interact with the contract instance, and never with the underlying logic contract. However, nothing prevents a malicious actor from sending transactions to the logic contract directly. This does not pose a threat, since any changes to the state of the logic contracts do not affect your contract instances, as the storage of the logic contracts is never used in your project.

There is, however, an exception. If the direct call to the logic contract triggers a selfdestruct operation, then the logic contract will be destroyed, and all your contract instances will end up delegating all calls to an address without any code. This would effectively break all contract instances in your project.

A similar effect can be achieved if the logic contract contains a delegatecall operation. If the contract can be made to delegatecall into a malicious contract that contains a selfdestruct, then the calling contract will be destroyed.

As such, it is not allowed to use either selfdestruct or delegatecall in your contracts.

read to the end: https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable

 */