# Synphonic NFT Platform

A decentralized platform for minting and managing music NFTs on the NEAR blockchain.

## Features

- Mint music NFTs with metadata
- View and manage your NFT collection
- IPFS integration for decentralized storage
- NEAR wallet integration
- Modern React UI with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- NEAR wallet account
- IPFS node (optional, can use public gateway)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/synphonic-project.git
cd synphonic-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
REACT_APP_NEAR_NETWORK_ID=testnet
REACT_APP_NEAR_NODE_URL=https://rpc.testnet.near.org
REACT_APP_NEAR_WALLET_URL=https://wallet.testnet.near.org
REACT_APP_NEAR_HELPER_URL=https://helper.testnet.near.org
REACT_APP_NEAR_EXPLORER_URL=https://explorer.testnet.near.org
REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

## Development

1. Start the development server:
```bash
npm start
```

2. Build the smart contract:
```bash
cd contract
npm run build
```

3. Deploy the contract (requires NEAR CLI):
```bash
npm run deploy
```

## Project Structure

```
synphonic-project/
├── contract/           # NEAR smart contract
│   ├── assembly/      # AssemblyScript source
│   └── build/         # Compiled contract
├── src/               # React application
│   ├── components/    # React components
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utility functions
│   └── App.tsx        # Main application
└── public/            # Static assets
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
