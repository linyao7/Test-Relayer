
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import './MyTokenInterface.sol';

contract TxnHandler{
    MyTokenInterface public tokenInterface;

    constructor(address tokenAddress) {
        tokenInterface = MyTokenInterface(tokenAddress);
    }

    function giveTokens() public view returns(string memory){
        return tokenInterface.getString();
    }
    
}