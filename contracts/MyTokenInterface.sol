// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

interface MyTokenInterface{
    function giveTokens(address receiver) external;
    function getString() external pure returns(string memory);
}