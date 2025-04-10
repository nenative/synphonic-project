import { context, storage, logging, PersistentMap } from "near-sdk-as";

// Define AssemblyScript types
type i32 = number;

// Simple token class
class Token {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  media: string;

  constructor(id: string, owner_id: string, title: string, description: string, media: string) {
    this.id = id;
    this.owner_id = owner_id;
    this.title = title;
    this.description = description;
    this.media = media;
  }
}

// Simple NFT contract
export class SynphonicNFT {
  private tokens: PersistentMap<string, Token>;
  private tokenIds: string[];

  constructor() {
    this.tokens = new PersistentMap<string, Token>("t");
    this.tokenIds = [];
  }

  nft_mint(token_id: string, title: string, description: string, media: string): void {
    const token = new Token(token_id, context.sender, title, description, media);
    this.tokens.set(token_id, token);
    this.tokenIds.push(token_id);
    logging.log(`Minted token ${token_id} for ${context.sender}`);
  }

  nft_token(token_id: string): Token | null {
    return this.tokens.get(token_id);
  }

  nft_tokens_for_owner(account_id: string): Token[] {
    const result: Token[] = [];
    for (let i = 0; i < this.tokenIds.length; i++) {
      const token = this.tokens.get(this.tokenIds[i]);
      if (token && token.owner_id === account_id) {
        result.push(token);
      }
    }
    return result;
  }
} 