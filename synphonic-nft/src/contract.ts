// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';

@NearBindgen({})
class TokenMetadata {
  title: string;
  description: string;
  media: string;
  extra: string;

  constructor({ title, description, media, extra }: { title: string; description: string; media: string; extra: string }) {
    this.title = title;
    this.description = description;
    this.media = media;
    this.extra = extra;
  }
}

@NearBindgen({})
class Token {
  owner_id: string;
  metadata: TokenMetadata;

  constructor({ owner_id, metadata }: { owner_id: string; metadata: TokenMetadata }) {
    this.owner_id = owner_id;
    this.metadata = metadata;
  }
}

@NearBindgen({})
class SynphonicNFT {
  tokens: UnorderedMap<Token>;
  owner_id: string;

  constructor() {
    this.tokens = new UnorderedMap<Token>("tokens");
    this.owner_id = near.signerAccountId();
  }

  @call({})
  nft_mint({ token_id, metadata }: { token_id: string; metadata: TokenMetadata }): void {
    near.log(`Minting token ${token_id} for ${near.signerAccountId()}`);
    const token = new Token({
      owner_id: near.signerAccountId(),
      metadata
    });
    this.tokens.set(token_id, token);
  }

  @view({})
  nft_token({ token_id }: { token_id: string }): Token | null {
    near.log(`Getting token ${token_id}`);
    return this.tokens.get(token_id);
  }

  @view({})
  nft_tokens_for_owner({ account_id }: { account_id: string }): Token[] {
    near.log(`Getting tokens for owner ${account_id}`);
    const tokens: Token[] = [];
    const keys = this.tokens.keys();
    for (let i = 0; i < keys.length; i++) {
      const token = this.tokens.get(keys[i]);
      if (token && token.owner_id === account_id) {
        tokens.push(token);
      }
    }
    return tokens;
  }
}