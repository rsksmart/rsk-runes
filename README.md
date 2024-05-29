<img src="rootstock-logo.png" alt="RSK Logo" style="width:100%; height: auto;" />

# Runes Mock Bridge

This project is an open-source proof of concept implementing a Runes Mock Bridge. The primary goal is to allow users to etch (and eventually mint) Runes on the Bitcoin network and create a 1:1 representation of these Runes as ERC20 tokens on the Rootstock (RSK) network.

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Future Development](#future-development)
- [Contributing](#contributing)
- [Support](#support)

## Overview

The Runes Mock Bridge consists of two main processes:

1. **Etching Runes on Bitcoin**: Users can etch Runes containing data entered through a form. A signer instantiated on Rootstock signs the transaction, creating the Rune without the user needing to sign any transactions directly.
2. **Creating ERC20 Representation on RSK**: Once a Rune is etched on Bitcoin, the system calls an ERC20 Factory to deploy an ERC20 token contract on RSK. The token's information is based on the user's input for the Rune. The user receives the specified amount of tokens in a "premine" specified during the Rune creation.

## Technologies Used

- **Runelib**: [Runelib GitHub](https://github.com/sCrypt-Inc/runelib)
- **BitcoinJS**: [BitcoinJS GitHub](https://github.com/bitcoinjs/bitcoinjs-lib)
- **Hardhat**: [Hardhat Documentation](https://hardhat.org/docs)
- **OpenZeppelin Standards**: [OpenZeppelin](https://www.openzeppelin.com/)
- **ShadCN**: [ShadCN Documentation](https://ui.shadcn.com/docs)
- **Ethers.js**: [Ethers.js Documentation](https://docs.ethers.org/v5/)

## Project Structure

```
├── app
│   ├── layout.tsx
│   ├── page.tsx
│   └── utils
│       ├── abi
│       └── hooks
│           └── useRuneERC20.tsx
├── components
│   ├── tabs
│   │   ├── EtchTab.tsx
│   │   ├── index.tsx
│   │   ├── LastEtchTab.tsx
│   │   └── MintTab.tsx
│   └── ui
├── components.json
├── constants
│   └── index.ts
├── functions
│   └── index.ts
├── lib
│   └── utils.ts
├── package.json
```

## Installation

To clone and run this project locally, follow these steps:

1. **Clone the repository**:

   ```sh
   git clone https://github.com/ezequiel-rodriguez/rsk-runes.git
   cd rsk-runes
   ```

2. **Install dependencies**:

   ```sh
   yarn
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory and add necessary environment variables. Example:

   ```sh
   RSK_PROVIDER_URL="https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
   PRIVATE_KEY="your-private-key"
   ```

4. **Run the development server**:

   ```sh
   yarn dev
   ```

## Usage

1. **Access the application**: Open [http://localhost:3000](http://localhost:3000) in your browser.
2. **Etch a Rune**: Navigate to the Etch tab, fill out the form, and submit to etch a Rune on Bitcoin.
3. **View ERC20 Representation**: After etching, view the deployed ERC20 token details on the Last Etch tab.

## Future Development

- **Minting Runes**: The minting functionality is under development and will be available in future releases.

## Contributing

We welcome contributions from the community. Please fork the repository and submit pull requests with your changes. Ensure your code adheres to the project's main objective.

## Support

For any questions or support, please open an issue on the repository or reach out to the maintainers.
