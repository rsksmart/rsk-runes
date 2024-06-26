// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RuneToken is ERC1155, Ownable {
    event TokensFrozen(address indexed account, uint256 indexed tokenId, uint256 amount);
    event TokensUnfrozen(address indexed account, uint256 indexed tokenId, uint256 amount);

    struct Balance {
        address account;
        uint256 balance;
    }

    struct TokenInfo {
        string uri;
        string name;
        string symbol;
        uint256 maxSupply;
        uint256 currentSupply;
        uint256 defaultMintAmount;
        Balance balance;
    }

    mapping(uint256 => TokenInfo) private _tokenInfos;
    mapping(address => uint256[]) private _userTokens;
    mapping(uint256 => mapping(address => uint256)) private _frozenTokens;

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    /**
     * @dev Returns the URI for a given token ID
     * @param tokenId ID of the token to query
     * @return URI of the token
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenInfos[tokenId].uri;
    }

    /**
     * @dev Mints a new fungible token
     * @param tokenURI URI of the token
     * @param runeName Unique name of the rune
     * @param symbol Symbol of the token
     * @param maxSupply Maximum supply of the token
     * @param initialSupply Initial supply of the token
     * @param defaultMintAmount Default amount to mint each time
     */
    function mintFungible(
        string memory tokenURI,
        string memory runeName,
        string memory symbol,
        uint256 maxSupply,
        uint256 initialSupply,
        uint256 defaultMintAmount,
        address receiver
    ) public onlyOwner {
        require(
            initialSupply <= maxSupply,
            "Initial supply exceeds max supply"
        );

        bytes32 tokenIdHash = keccak256(abi.encodePacked(runeName));
        uint256 tokenId = uint256(tokenIdHash);
        require(_tokenInfos[tokenId].maxSupply == 0, "Token ID already exists");

        _tokenInfos[tokenId] = TokenInfo({
            uri: tokenURI,
            name: runeName,
            symbol: symbol,
            maxSupply: maxSupply,
            currentSupply: initialSupply,
            defaultMintAmount: defaultMintAmount,
            balance: Balance(address(0), 0)
        });

        _mint(receiver, tokenId, initialSupply, "");
        _addUserToken(receiver, tokenId);
    }

    /**
     * @dev Mints a new non-fungible token in case the rune has only 1 unit on creation, and max cap of 1
     * @param tokenURI URI of the token
     * @param runeName Unique name of the rune
     * @param symbol Symbol of the token
     */
    function mintNonFungible(
        string memory tokenURI,
        string memory runeName,
        string memory symbol,
        address receiver
    ) public onlyOwner {
        bytes32 tokenIdHash = keccak256(abi.encodePacked(runeName));
        uint256 tokenId = uint256(tokenIdHash);
        require(_tokenInfos[tokenId].maxSupply == 0, "Token ID already exists");

        _tokenInfos[tokenId] = TokenInfo({
            uri: tokenURI,
            name: runeName,
            symbol: symbol,
            maxSupply: 1,
            currentSupply: 1,
            defaultMintAmount: 1,
            balance: Balance(address(0), 0)
        });

        _mint(receiver, tokenId, 1, "");
        _addUserToken(receiver, tokenId);
    }

    /**
     * @dev Mints more of an existing token, if the token is fungible and if the max supply has not been reached
     * @param runeName Bitcoin (unique) name of the rune to mint more of
     */
    function mintMore(
        string memory runeName,
        address receiver
    ) external onlyOwner {
        bytes32 tokenIdHash = keccak256(abi.encodePacked(runeName));
        uint256 tokenId = uint256(tokenIdHash);

        require(_tokenInfos[tokenId].maxSupply > 0, "Token ID does not exist");
        require(
            _tokenInfos[tokenId].currentSupply +
                _tokenInfos[tokenId].defaultMintAmount <=
                _tokenInfos[tokenId].maxSupply,
            "Exceeds max supply"
        );

        _mint(receiver, tokenId, _tokenInfos[tokenId].defaultMintAmount, "");
        _tokenInfos[tokenId].currentSupply += _tokenInfos[tokenId]
            .defaultMintAmount;
        _addUserToken(receiver, tokenId);
    }

    /**
     * @dev Freezes tokens for a specific user
     * @param tokenId ID of the token to freeze
     * @param amount Amount of tokens to freeze
     */
    function freezeTokens(uint256 tokenId, uint256 amount, address owner) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(owner, tokenId) >= amount, "Insufficient balance to freeze");

        _frozenTokens[tokenId][owner] += amount;
        emit TokensFrozen(owner, tokenId, amount);
    }

    /**
     * @dev Unfreezes tokens for a specific user
     * @param tokenId ID of the token to unfreeze
     * @param amount Amount of tokens to unfreeze
     */
    function unfreezeTokens(uint256 tokenId, uint256 amount, address owner) external onlyOwner{
        require(amount > 0, "Amount must be greater than zero");
        require(_frozenTokens[tokenId][owner] >= amount, "Insufficient frozen balance to unfreeze");

        _frozenTokens[tokenId][owner] -= amount;
        emit TokensUnfrozen(owner, tokenId, amount);
    }

    /**
     * @dev Returns the information of a token
     * @param tokenId ID of the token to query
     * @return TokenInfo struct containing the token's information
     */
    function getTokenInfo(
        uint256 tokenId,
        address holder
    ) public view returns (TokenInfo memory) {
        TokenInfo memory tokenInfo = _tokenInfos[tokenId];
        require(tokenInfo.maxSupply > 0, "Token ID does not exist");

        if (holder != address(0)) {
            uint256 userBalance = balanceOf(holder, tokenId);
            tokenInfo.balance = Balance(holder, userBalance);
        }

        return tokenInfo;
    }

    /**
     * @dev Returns the token IDs owned by a user
     * @param user Address of the user to query
     * @return Array of token IDs owned by the user
     */
    function getUserTokens(
        address user
    ) public view returns (uint256[] memory) {
        return _userTokens[user];
    }

    /**
     * @dev Adds a token ID to the list of tokens owned by a user
     * @param user Address of the user
     * @param tokenId ID of the token to add
     */
    function _addUserToken(address user, uint256 tokenId) internal {
        bool tokenExists = false;
        for (uint256 i = 0; i < _userTokens[user].length; i++) {
            if (_userTokens[user][i] == tokenId) {
                tokenExists = true;
                break;
            }
        }
        if (!tokenExists) {
            _userTokens[user].push(tokenId);
        }
    }

    /**
     * @dev Override the balanceOf function to consider frozen tokens
     */
    function balanceOf(address account, uint256 tokenId) public view override returns (uint256) {
        uint256 totalBalance = super.balanceOf(account, tokenId);
        uint256 frozenBalance = _frozenTokens[tokenId][account];
        return totalBalance - frozenBalance;
    }
    /**
     * @dev Override the safeTransferFrom function to consider frozen tokens
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(balanceOf(from, id) >= amount + _frozenTokens[id][from], "Insufficient unlocked balance for transfer");
        super.safeTransferFrom(from, to, id, amount, data);
    }

    /**
     * @dev Override the safeBatchTransferFrom function to consider frozen tokens
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        for (uint256 i = 0; i < ids.length; i++) {
            require(balanceOf(from, ids[i]) >= amounts[i] + _frozenTokens[ids[i]][from], "Insufficient unlocked balance for transfer");
        }
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}
