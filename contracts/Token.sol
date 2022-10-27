// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PeerSharePlace is ERC20, Ownable {

    constructor() ERC20("PeerSharePlace", "BLOCKS") {
        _mint(msg.sender,1000000000*10**18);
    }
}