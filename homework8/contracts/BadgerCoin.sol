// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BadgerCoin is ERC20 {
    // Variables
    uint256 public immutable TOTAL_SUPPLY;
    uint256 public immutable DECIMALS;

    constructor(
        uint256 _TOTAL_SUPPLY,
        uint256 _DECIMALS
    ) ERC20("BadgerCoin", "BC") {
        TOTAL_SUPPLY = _TOTAL_SUPPLY;
        DECIMALS = _DECIMALS;
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    function mint() public {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
}
