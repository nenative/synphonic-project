'use client';

import React, { useState, useEffect } from 'react';
import { useWalletSelector } from '@near-wallet-selector/core';
import { uploadToIPFS } from '@/lib/ipfs';

export default function MusicNFTMinter() {
  const { selector, accountId } = useWalletSelector();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if file is an audio file
      if (selectedFile.type.startsWith('audio/') || 
          selectedFile.name.endsWith('.mp3') || 
          selectedFile.name.endsWith('.wav') || 
          selectedFile.name.endsWith('.flac')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload an audio file (MP3, WAV, or FLAC)');
        setFile(null);
      }
    }
  };

  const handleMint = async () => {
    if (!accountId) {
      setError('Please connect your wallet first');
      return;
    }

    if (!file || !title || !description || !artist) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Upload file to IPFS
      const ipfsUrl = await uploadToIPFS(file);
      
      // Get the wallet
      const wallet = await selector.wallet();
      
      // Create metadata for the NFT
      const metadata = {
        title,
        description,
        media: ipfsUrl,
        media_hash: '', // This would be a hash of the file in a real implementation
        copies: 1,
        artist,
        genre,
        issued_at: Date.now().toString(),
        expires_at: '0',
        starts_at: '0',
        updated_at: Date.now().toString(),
        extra: JSON.stringify({
          duration: '0:00', // This would be extracted from the audio file in a real implementation
        }),
        reference: '',
        reference_hash: ''
      };
      
      // Generate a unique token ID
      const tokenId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Call the contract's nft_mint function
      const result = await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: process.env.NEXT_PUBLIC_CONTRACT_ID || '',
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'nft_mint',
              args: {
                token_id: tokenId,
                metadata
              },
              gas: '300000000000000',
              deposit: '0'
            }
          }
        ]
      });
      
      setSuccess(`NFT minted successfully! Transaction hash: ${result.transaction.hash}`);
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setArtist('');
      setGenre('');
    } catch (err) {
      console.error('Error minting NFT:', err);
      setError('Failed to mint NFT. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Mint Your Music NFT</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Audio File (MP3, WAV, FLAC)</label>
          <input
            type="file"
            accept=".mp3,.wav,.flac,audio/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          {file && (
            <p className="mt-1 text-sm text-gray-600">
              Selected: {file.name}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter song title"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Describe your music"
            rows={3}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Artist *</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter artist name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter music genre"
          />
        </div>
        
        <button
          onClick={handleMint}
          disabled={isLoading || !accountId}
          className={`w-full py-2 px-4 rounded ${
            isLoading || !accountId
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? 'Minting...' : accountId ? 'Mint NFT' : 'Connect Wallet First'}
        </button>
      </div>
    </div>
  );
} 