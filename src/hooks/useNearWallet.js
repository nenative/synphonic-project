import { useState, useEffect, useCallback } from 'react';
import { connect, keyStores, WalletConnection } from 'near-api-js';

const CONTRACT_NAME = process.env.REACT_APP_CONTRACT_NAME || 'dev-1234567890';

export const useNearWallet = () => {
  const [accountId, setAccountId] = useState(null);
  const [walletConnection, setWalletConnection] = useState(null);

  useEffect(() => {
    const initNear = async () => {
      const config = {
        networkId: 'testnet',
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      };

      try {
        const near = await connect(config);
        const wallet = new WalletConnection(near);

        if (wallet.isSignedIn()) {
          setAccountId(wallet.getAccountId());
        }

        setWalletConnection(wallet);
      } catch (error) {
        console.error('Error initializing NEAR:', error);
      }
    };

    initNear();
  }, []);

  const signIn = useCallback(() => {
    if (walletConnection) {
      walletConnection.requestSignIn({
        contractId: CONTRACT_NAME,
        methodNames: ['nft_mint', 'nft_transfer', 'nft_approve'],
      });
    }
  }, [walletConnection]);

  const signOut = useCallback(() => {
    if (walletConnection) {
      walletConnection.signOut();
      setAccountId(null);
    }
  }, [walletConnection]);

  const purchaseNFT = useCallback(async (tokenId, price) => {
    if (!walletConnection || !accountId) {
      throw new Error('Please connect your wallet first');
    }

    try {
      // Call the NFT purchase method on the contract
      await walletConnection.account().functionCall({
        contractId: CONTRACT_NAME,
        methodName: 'nft_purchase',
        args: {
          token_id: tokenId,
        },
        attachedDeposit: price, // Price in yoctoNEAR
        gas: '300000000000000', // 300 TGas
      });
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      throw error;
    }
  }, [walletConnection, accountId]);

  const mintNFT = useCallback(async (title, description, file) => {
    if (!walletConnection || !accountId) {
      throw new Error('Please connect your wallet first');
    }

    try {
      // TODO: Implement IPFS upload for the file
      const metadata = {
        title,
        description,
        media: 'https://example.com/placeholder.mp3', // Replace with actual IPFS URL
      };

      // Call the NFT minting method on the contract
      await walletConnection.account().functionCall({
        contractId: CONTRACT_NAME,
        methodName: 'nft_mint',
        args: {
          token_id: `${Date.now()}`,
          metadata,
          receiver_id: accountId,
        },
        attachedDeposit: '10000000000000000000000', // 0.01 NEAR
        gas: '300000000000000', // 300 TGas
      });
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }, [walletConnection, accountId]);

  return {
    accountId,
    signIn,
    signOut,
    purchaseNFT,
    mintNFT,
  };
};

export default useNearWallet; 