const { Contract } = require('near-api-js');

class MusicNFTContract extends Contract {
  // Mint a new music NFT
  async mintMusicNFT({ title, description, mediaUrl }) {
    const metadata = {
      title,
      description,
      media: mediaUrl,
      media_hash: null, // We'll add this later for security
      copies: 1, // Single edition NFTs
    };

    return await this.nft_mint({
      token_id: `${Date.now()}`,
      metadata,
      receiver_id: this.account.accountId,
    });
  }

  // Get NFTs owned by an account
  async getNFTsForOwner(accountId) {
    return await this.nft_tokens_for_owner({
      account_id: accountId,
      from_index: '0',
      limit: 50,
    });
  }
}

module.exports = {
  loadContract: async (account) => {
    return new MusicNFTContract(
      account, // NEAR account
      'synphonic.testnet', // Change this to your contract name
      {
        viewMethods: ['nft_tokens_for_owner'],
        changeMethods: ['nft_mint'],
      }
    );
  },
}; 