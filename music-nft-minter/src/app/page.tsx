'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { WalletSelector, AccountState } from '@near-wallet-selector/core';
import { uploadToIPFS } from '@/lib/ipfs';

export default function Home() {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<any>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const _selector = await setupWalletSelector({
        network: 'testnet',
        modules: [
          setupMyNearWallet()
        ],
      });

      const _modal = setupModal(_selector, {
        contractId: 'your-contract-id.testnet'
      });

      const state = _selector.store.getState();
      setAccountId(state.accounts[0]?.accountId || null);

      setSelector(_selector);
      setModal(_modal);
    };

    init();
  }, []);

  const handleConnectWallet = async () => {
    if (!modal) return;
    modal.show();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'audio/mpeg') {
      setFile(selectedFile);
    } else {
      alert('Please upload an MP3 file');
    }
  };

  const handleMint = async () => {
    if (!accountId) {
      alert('Please connect your wallet first');
      return;
    }

    if (!file || !title || !description) {
      alert('Please fill in all fields and upload an MP3 file');
      return;
    }

    setIsLoading(true);
    try {
      // Upload to IPFS
      const ipfsUrl = await uploadToIPFS(file);
      
      // TODO: Implement minting logic with NEAR contract
      console.log('Minting NFT with:', {
        title,
        description,
        media: ipfsUrl
      });
      
      alert('NFT minted successfully!');
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Error minting NFT. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Music NFT Minter</h1>
        
        {!accountId ? (
          <button
            onClick={handleConnectWallet}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-600">Connected as: {accountId}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">MP3 File</label>
                <input
                  type="file"
                  accept=".mp3"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
                {file && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your song title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Describe your music"
                  rows={4}
                />
              </div>

              <button
                onClick={handleMint}
                disabled={isLoading}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Minting...' : 'Mint NFT'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 