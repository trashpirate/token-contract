// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {

    uint256 constant _initial_supply = 1000000000 * (10**18);

    constructor() ERC20("Token", "TOKEN") {
        
        _mint(msg.sender,_initial_supply);
    }
}