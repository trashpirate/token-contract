// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Token {

    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address spender, uint256 value);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);

        // assign total supply to deployer
        balanceOf[msg.sender] = totalSupply;
    }


    /** INTERNAL FUNCTIONS */
    function _mint(address account, uint256 amount) internal {
        
        require(account != address(0), "ERC20: mint to the zero address");

        totalSupply += amount;

        unchecked {
            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
            balanceOf[account] += amount;
        }
        emit Transfer(address(0), account, amount);

    }

    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        require(_to != address(0));

        unchecked {
            // Deduct tokens from spender
            balanceOf[_from] -= _value;
            // Credit tokens to receiver
            balanceOf[_to] += _value;
        }

        //Emit event
        emit Transfer(_from, _to, _value);
    }

    function _approve(address _owner, address _spender, uint256 _amount)
        internal
    {
        require(_owner != address(0), "ERC20: approve from the zero address");
        require(_spender != address(0), "ERC20: approve to the zero address");

        allowance[_owner][_spender] = _amount;

        emit Approval(_owner, _spender, _amount);
    }

    function _spendAllowance(
        address _owner,
        address _spender,
        uint256 _amount
    ) internal {
        uint256 _currentAllowance = allowance[_owner][_spender];
        if (_currentAllowance != type(uint256).max) {
            require(_currentAllowance >= _amount, "ERC20: insufficient allowance");
            require(balanceOf[_owner] >= _amount, "ERC20: insufficient allowance");

            unchecked {
                _approve(_owner, _spender, _currentAllowance - _amount);
            }
        }
    }

    /** PUBLIC ERC20 COMPLIENT FUNCTIONS */

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        // Require that sender is valid and has enough tokens
        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender, _to, _value);
        
        return true;
    }

    function approve(address _spender, uint256 _amount)
        public
        returns (bool success)
    {
        address _owner = msg.sender;
        _approve(_owner, _spender, _amount);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) 
        public 
        returns (bool success) 
    {   

        address _spender = msg.sender;
        _spendAllowance(_from, _spender, _amount);

        // spend tokens
        _transfer(_from, _to, _amount);
        
        return true;
    }
}
