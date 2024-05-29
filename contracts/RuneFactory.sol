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

contract RuneFactory {
    event TokenCreated(address tokenAddress, string name, string symbol, uint256 initialSupply, address initialOwner, uint256 runeIDBTC);
    struct Token {
        string name;
        string symbol;
        uint256 initialSupply;
        address initialOwner;
        uint256 runeIDBTC;
        uint256 mintAmount;
        uint256 maxSupply;
    }
    Token[] public tokens;

    function getTokenCount() public view returns (uint256) {
        return tokens.length;
    }

    function getToken(uint256 index) public view returns (Token memory) {
        return tokens[index];
    }

    function getTokens() public view returns (Token[] memory) {
        return tokens;
    }

    function getTokenAddress(
        string memory name, 
        string memory symbol, 
        uint256 initialSupply, 
        address initialOwner, 
        bytes32 salt, 
        uint256 _mintAmount,
        uint256 _maxSupply
    ) public view returns (address) {
        bytes memory bytecode = abi.encodePacked(
            type(Rune).creationCode,
            abi.encode(name, symbol, initialSupply, initialOwner, _mintAmount, _maxSupply)
        );
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(bytecode)
            )
        );
        return address(uint160(uint(hash)));
    }

    function createRune(
        string memory name, 
        string memory symbol, 
        uint256 initialSupply,
        address initialOwner, 
        uint256 runeIDBTC, 
        bytes32 salt, 
        uint256 _mintAmount, 
        uint256 _maxSupply
    ) public {
        address predictedAddress = getTokenAddress(name, symbol, initialSupply, initialOwner, salt, _mintAmount, _maxSupply);
        Rune newToken = new Rune{salt: salt}(name, symbol, initialSupply, initialOwner, _mintAmount, _maxSupply);
        require(address(newToken) == predictedAddress, "Address prediction failed");
        tokens.push(Token(name, symbol, initialSupply, initialOwner, runeIDBTC, _mintAmount, _maxSupply));
        emit TokenCreated(address(newToken), name, symbol, initialSupply, initialOwner, runeIDBTC);
    }
}
