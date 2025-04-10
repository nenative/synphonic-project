import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';

@NearBindgen({})
class TokenMetadata {
  title: string;
  description: string;
  media: string;
  media_hash: string;
  copies: number;
  artist: string;
  genre: string;
  issued_at: number;
  expires_at: number;
  starts_at: number;
  updated_at: number;
  extra: string;
  reference: string;
  reference_hash: string;

  constructor(
    title: string,
    description: string,
    media: string,
    media_hash: string,
    copies: number,
    issued_at: number,
    expires_at: number,
    starts_at: number,
    updated_at: number,
    extra: string,
    reference: string,
    reference_hash: string,
    artist: string = "",
    genre: string = ""
  ) {
    this.title = title;
    this.description = description;
    this.media = media;
    this.media_hash = media_hash;
    this.copies = copies;
    this.issued_at = issued_at;
    this.expires_at = expires_at;
    this.starts_at = starts_at;
    this.updated_at = updated_at;
    this.extra = extra;
    this.reference = reference;
    this.reference_hash = reference_hash;
    this.artist = artist;
    this.genre = genre;
  }
}

@NearBindgen({})
class Token {
  id: string;
  owner_id: string;
  metadata: TokenMetadata;

  constructor(id: string, owner_id: string, metadata: TokenMetadata) {
    this.id = id;
    this.owner_id = owner_id;
    this.metadata = metadata;
  }
}

@NearBindgen({})
class Contract {
  tokens: UnorderedMap<Token>;
  owner_id: string;

  constructor() {
    this.tokens = new UnorderedMap<Token>("tokens");
    this.owner_id = near.signerAccountId();
  }

  @view({})
  nft_total_supply(): number {
    return this.tokens.length;
  }

  @view({})
  nft_token({ token_id }: { token_id: string }): Token | null {
    return this.tokens.get(token_id);
  }

  @view({})
  nft_tokens_for_owner({ account_id }: { account_id: string }): Token[] {
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

  @call({})
  nft_mint({ token_id, metadata }: { token_id: string; metadata: TokenMetadata }): void {
    near.log(`Minting token ${token_id} for ${near.signerAccountId()}`);
    
    // Validate metadata
    if (!metadata.media || !metadata.title || !metadata.artist) {
      throw new Error("Missing required metadata fields");
    }

    // Validate audio file extension
    const mediaLower = metadata.media.toLowerCase();
    if (!mediaLower.endsWith(".mp3") && !mediaLower.endsWith(".wav") && !mediaLower.endsWith(".flac")) {
      throw new Error("Invalid audio file format. Supported formats: MP3, WAV, FLAC");
    }

    const token = new Token(token_id, near.signerAccountId(), metadata);
    this.tokens.set(token_id, token);
  }
} 