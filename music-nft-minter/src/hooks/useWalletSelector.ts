import { useEffect, useState } from 'react';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';

export function useWalletSelector() {
  const [selector, setSelector] = useState<any>(null);
  const [modal, setModal] = useState<any>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const _selector = await setupWalletSelector({
        network: 'testnet',
        modules: [
          setupMyNearWallet(),
          setupNearWallet(),
          setupSender(),
          setupHereWallet(),
          setupMeteorWallet(),
        ],
      });

      const _modal = setupModal(_selector, {
        contractId: process.env.NEXT_PUBLIC_CONTRACT_ID || '',
      });

      setSelector(_selector);
      setModal(_modal);

      const state = _selector.store.getState();
      setAccountId(state.accounts[0]?.accountId || null);

      _selector.on('accountsChanged', (accounts: any[]) => {
        setAccountId(accounts[0]?.accountId || null);
      });
    };

    init();
  }, []);

  const signIn = async () => {
    if (!modal) return;
    modal.show();
  };

  const signOut = async () => {
    if (!selector) return;
    const wallet = await selector.wallet();
    await wallet.signOut();
  };

  return {
    selector,
    modal,
    accountId,
    signIn,
    signOut,
  };
} 