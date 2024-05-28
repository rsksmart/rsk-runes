# Runes Bridge Smart Contracts on RSK Network

## Frontend integration
In the frontend, you must use first, the Factory function called ```getTokenAddress```

```javascript
 function getTokenAddress(
  string memory name, 
  string memory symbol, 
  uint256 initialSupply, 
  address initialOwner, 
  bytes32 salt
) public view returns (address) {
        bytes memory bytecode = abi.encodePacked(
            type(Rune).creationCode,
            abi.encode(name, symbol, initialSupply, initialOwner)
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
```
This function will provide the address the new ERC20 contract will have, take care to store the salt and the address in a secure place, because you will need it to interact with the contract. 
The salt value is a random value, you can use the following function to generate it:
```javascript
const ethers = require('ethers');

function generateSalt() {
    const randomString = new Date().toISOString() + Math.random().toString();
    const salt = ethers.utils.id(randomString);
    console.log("Generated salt:", salt);
    return salt;
}

generateSalt();
```
it would generate a value like ```0x5f9c84be66500d7b7c3e564e2d5a01e99ff519fb8e52ad919cfb2487ff7c7cba```

Then, store this future address in your script, and use the same data used to calculate the new address, and pass this data to the smart contract function for creating rune.

```javascript
 function createRune(string memory name, string memory symbol, uint256 initialSupply, address initialOwner, uint256 runeIDBTC, bytes32 salt) public {
    address predictedAddress = getTokenAddress(name, symbol, initialSupply, initialOwner, salt);
    Rune newToken = new Rune{salt: salt}(name, symbol, initialSupply, initialOwner);
    require(address(newToken) == predictedAddress, "Address prediction failed");
    tokens.push(Token(name, symbol, initialSupply, initialOwner, runeIDBTC));
    emit TokenCreated(address(newToken));
}
```
This function will create a new ERC20 contract, and store the data in the tokens array, and emit an event with the new contract address.

To get the address of the new contract, you can listen to the event TokenCreated, and get the address from the event.

To fetch data from the runes created, you can use the next functions.

```javascript
function getTokenCount() public view returns (uint256) {
        return tokens.length;
}

function getToken(uint256 index) public view returns (Token memory) {
    return tokens[index];
}

function getTokens() public view returns (Token[] memory) {
    return tokens;
}
```