import { Context, storage, logging, PersistentMap } from "near-sdk-as";

@nearBindgen
export class MusicMetadata {
  constructor(
    public title: string,
    public artist: string,
    public audio_url: string,
    public cover_art_url: string,
    public duration: string,
    public genre: string,
    public release_date: string,
    public description: string
  ) {}
}

@nearBindgen
export class Token {
  id: string;
  owner_id: string;
  metadata: MusicMetadata;

  constructor(id: string, owner_id: string, metadata: MusicMetadata) {
    this.id = id;
    this.owner_id = owner_id;
    this.metadata = metadata;
  }
}

const tokens = new PersistentMap<string, Token>("t");
const tokensByOwner = new PersistentMap<string, string[]>("to");

export function nft_mint(
  token_id: string,
  title: string,
  artist: string,
  audio_url: string,
  cover_art_url: string,
  duration: string,
  genre: string,
  release_date: string,
  description: string
): void {
  const owner_id = Context.sender;
  
  // Create metadata
  const metadata = new MusicMetadata(
    title,
    artist,
    audio_url,
    cover_art_url,
    duration,
    genre,
    release_date,
    description
  );

  // Create token
  const token = new Token(token_id, owner_id, metadata);
  
  // Save token
  tokens.set(token_id, token);
  
  // Add to owner's tokens
  let ownerTokens = tokensByOwner.get(owner_id, []);
  ownerTokens.push(token_id);
  tokensByOwner.set(owner_id, ownerTokens);
  
  logging.log(`Minted NFT ${token_id} to ${owner_id}`);
}

export function nft_token(token_id: string): Token | null {
  return tokens.get(token_id);
}

export function nft_tokens_for_owner(owner_id: string): Token[] {
  const ownerTokens = tokensByOwner.get(owner_id, []);
  let tokens_array: Token[] = [];
  
  for (let i = 0; i < ownerTokens.length; i++) {
    const token = tokens.get(ownerTokens[i]);
    if (token) {
      tokens_array.push(token);
    }
  }
  
  return tokens_array;
} 