import { Context, PersistentMap, logging } from 'near-sdk-as';

// Simple token class without decorators
class SimpleToken {
  owner_id: string;
  title: string;
  description: string;
  media: string;

  constructor(owner_id: string, title: string, description: string, media: string) {
    this.owner_id = owner_id;
    this.title = title;
    this.description = description;
    this.media = media;
  }
}

// Simple NFT contract without decorators
export class SimpleNFT {
  private tokens: PersistentMap<string, SimpleToken>;
  private tokenIds: string[];

  constructor() {
    this.tokens = new PersistentMap<string, SimpleToken>("t");
    this.tokenIds = [];
  }

  // Mint a new token
  mint(token_id: string, title: string, description: string, media: string): void {
    const token = new SimpleToken(Context.sender, title, description, media);
    this.tokens.set(token_id, token);
    this.tokenIds.push(token_id);
    logging.log(`Minted token ${token_id} for ${Context.sender}`);
  }

  // Get a token by ID
  get_token(token_id: string): SimpleToken | null {
    return this.tokens.get(token_id);
  }

  // Get all tokens for an owner
  get_tokens_for_owner(account_id: string): SimpleToken[] {
    const result: SimpleToken[] = [];
    for (let i = 0; i < this.tokenIds.length; i++) {
      const token = this.tokens.get(this.tokenIds[i]);
      if (token && token.owner_id === account_id) {
        result.push(token);
      }
    }
    return result;
  }
} 