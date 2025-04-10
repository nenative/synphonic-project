import { Context, PersistentMap, PersistentVector, u128, u32, u64 } from "near-sdk-as";

// Define the decorators manually since they're not exported directly
function nearBindgen(target: any) {
  return target;
}

@nearBindgen
export class TokenMetadata {
  title: string;
  description: string;
  media: string;
  media_hash: string;
  copies: u32;
  artist: string;
  genre: string;
  issued_at: u64;
  expires_at: u64;
  starts_at: u64;
  updated_at: u64;
  // The extra field can be used to store music-specific metadata as JSON:
  // { 
  //   artist: string,  // Name of the artist
  //   genre: string,   // Music genre
  //   duration: string // Duration in format "MM:SS"
  // }
  extra: string;
  reference: string;
  reference_hash: string;

  constructor(
    title: string,
    description: string,
    media: string,
    media_hash: string,
    copies: u32,
    issued_at: u64,
    expires_at: u64,
    starts_at: u64,
    updated_at: u64,
    extra: string = "{}",  // Default empty JSON object for music metadata
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

@nearBindgen
export class Token {
  id: string;
  owner_id: string;
  metadata: TokenMetadata;
  approved_account_ids: PersistentMap<string, u64>;
  next_approval_id: u64;

  constructor(
    id: string,
    owner_id: string,
    metadata: TokenMetadata
  ) {
    this.id = id;
    this.owner_id = owner_id;
    this.metadata = metadata;
    this.approved_account_ids = new PersistentMap<string, u64>("a" + id);
    this.next_approval_id = 0;
  }
}

@nearBindgen
export class NFTContract {
  tokens: PersistentMap<string, Token>;
  owner_id: string;

  constructor() {
    this.tokens = new PersistentMap<string, Token>("tokens");
    this.owner_id = Context.sender;
  }
} 