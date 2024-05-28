// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Rune is ERC20, Ownable {
    uint256 private mintAmount;
    uint256 private maxSupply;
    constructor(string memory name, string memory symbol, uint256 initialSupply, address initialOwner, uint256 _mintAmount, uint256 _maxSupply)
        ERC20(name, symbol)
        Ownable(initialOwner) {
        _mint(initialOwner, initialSupply);
        mintAmount = _mintAmount;
        maxSupply = _maxSupply;
    }
    function mint(address to) public {
        require(totalSupply() + mintAmount <= maxSupply, "Mint amount exceeds max supply");
        _mint(to, mintAmount);
    }
    function getMintAmount() public view returns (uint256) {
        return mintAmount;
    }
    function getMaxSupply() public view returns (uint256) {
        return maxSupply;
    }
}