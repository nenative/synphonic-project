import React, { useState, useEffect } from 'react';
import { utils } from 'near-api-js';

interface NFTMetadata {
  title: string;
  description: string;
  media: string;
  artist: string;
  price: string;
  tokenId: string;
}

const MarketplaceListing: React.FC = () => {
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Placeholder data - replace with actual contract calls
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        // TODO: Replace with actual contract call
        const mockNFTs: NFTMetadata[] = [
          {
            title: "Summer Symphony",
            description: "A vibrant classical piece perfect for summer evenings",
            media: "https://example.com/summer.mp3",
            artist: "Jane Doe",
            price: "5",
            tokenId: "1"
          },
          // Add more mock data as needed
        ];
        setNfts(mockNFTs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const handlePlay = (tokenId: string) => {
    if (currentlyPlaying === tokenId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(tokenId);
    }
  };

  const handlePurchase = async (tokenId: string, price: string) => {
    try {
      // TODO: Implement purchase functionality
      console.log(`Purchasing NFT ${tokenId} for ${price} NEAR`);
    } catch (error) {
      console.error("Error purchasing NFT:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Music NFT Marketplace</h1>
      
      {/* Filters */}
      <div className="mb-8 flex justify-end space-x-4">
        <select className="border rounded-lg px-4 py-2">
          <option value="recent">Most Recent</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
            {/* Audio Preview */}
            <div className="relative h-48 bg-gradient-to-r from-purple-500 to-pink-500">
              <button
                onClick={() => handlePlay(nft.tokenId)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {currentlyPlaying === nft.tokenId ? (
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" />
                  ) : (
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  )}
                </svg>
              </button>
            </div>

            {/* NFT Info */}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{nft.title}</h3>
              <p className="text-gray-600 mb-4">{nft.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Artist: {nft.artist}</span>
                <span className="font-bold text-lg">{nft.price} NEAR</span>
              </div>
              <button
                onClick={() => handlePurchase(nft.tokenId, nft.price)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Purchase NFT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceListing; 