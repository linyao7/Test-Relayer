//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import './MyTokenInterface.sol';

contract MyToken is ERC20, MyTokenInterface {
    address public owner;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        //create 1b tokens
        _mint(msg.sender, 1000000000 * 10**uint(decimals()));
        owner = msg.sender;
    }

    function giveTokens(address receiver) override public {
        require(balanceOf(owner) >= 5, 'Not enough tokens to give out.');
        transfer(receiver, 5);
    }

    function getString() override public pure returns (string memory) {
        return 'Test String';
    }
}