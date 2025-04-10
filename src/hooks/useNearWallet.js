import { useState, useEffect } from 'react';
import { connect, keyStores, WalletConnection } from 'near-api-js';
import { loadContract } from '../contracts/nft-contract';

const CONTRACT_NAME = 'synphonic.testnet';
const NETWORK_ID = 'testnet';

const config = {
  networkId: NETWORK_ID,
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
  headers: {}
};

export const useNearWallet = () => {
  const [near, setNear] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initNear = async () => {
      const nearInstance = await connect(config);
      const walletConnection = new WalletConnection(nearInstance, 'synphonic');
      
      setNear(nearInstance);
      setWallet(walletConnection);
      
      if (walletConnection.isSignedIn()) {
        const accountId = walletConnection.getAccountId();
        setAccountId(accountId);
        
        // Initialize contract
        const account = walletConnection.account();
        const contractInstance = await loadContract(account);
        setContract(contractInstance);
      }
    };
    initNear();
  }, []);

  const signIn = () => {
    wallet?.requestSignIn(CONTRACT_NAME);
  };

  const signOut = () => {
    wallet?.signOut();
    setAccountId(null);
    setContract(null);
  };

  const mintNFT = async (title, description, file) => {
    if (!contract || !accountId) {
      throw new Error('Please connect your wallet first');
    }

    // For now, we'll use a placeholder URL
    // In a production app, you'd upload the file to IPFS or similar
    const mediaUrl = 'https://placeholder-url.com/music.mp3';

    try {
      return await contract.mintMusicNFT({
        title,
        description,
        mediaUrl,
      });
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  };

  return {
    near,
    wallet,
    accountId,
    contract,
    signIn,
    signOut,
    mintNFT,
  };
}; 