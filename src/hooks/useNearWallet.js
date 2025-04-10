import { useState, useEffect } from 'react';
import { connect, keyStores, WalletConnection } from 'near-api-js';

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

  useEffect(() => {
    const initNear = async () => {
      const nearInstance = await connect(config);
      const walletConnection = new WalletConnection(nearInstance, 'synphonic');
      setNear(nearInstance);
      setWallet(walletConnection);
      setAccountId(walletConnection.getAccountId());
    };
    initNear();
  }, []);

  const signIn = () => {
    wallet?.requestSignIn(CONTRACT_NAME);
  };

  const signOut = () => {
    wallet?.signOut();
    setAccountId(null);
  };

  return {
    near,
    wallet,
    accountId,
    signIn,
    signOut
  };
}; 