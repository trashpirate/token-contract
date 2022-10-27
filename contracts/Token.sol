// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RFCTToken is ERC20, Ownable {
    

    mapping (address => uint256) private _rOwned; // reflection amount
    mapping (address => uint256) private _tOwned; // token amount

    mapping (address => mapping (address => uint256)) private _allowances;

    mapping (address => bool) private _isExcludedFromFee;

    mapping (address => bool) private _isExcluded;
    address[] private _excluded;
   
    uint256 private constant MAX = ~uint256(0);
    uint256 private _tTotal;
    uint256 private _rTotal;
    uint256 private _tFeeTotal;

    string private _name;
    string private _symbol;
    uint256 private _decimals;
    
    uint256 public _taxFee;
    uint256 private _previousTaxFee;
    
    uint256 public _liquidityFee;
    uint256 private _previousLiquidityFee;

    IUniswapV2Router02 public immutable uniswapV2Router;
    address public immutable uniswapV2Pair;
    
    bool inSwapAndLiquify;
    bool public swapAndLiquifyEnabled = true;
    
    uint256 public _maxTxAmount;
    uint256 public numTokensSellToAddToLiquidity;
    

    constructor(uint256 _supply) ERC20("Reflection", "RFCT") {
        _mint(msg.sender, initialSupply);
    }
}