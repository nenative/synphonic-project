import { context, storage, logging, PersistentMap } from "near-sdk-as";

@nearBindgen
class TokenMetadata {
  constructor(
    public title: string,
    public description: string,
    public media: string,
    public media_hash: string | null,
    public copies: i32 = 1
  ) {}
}

@nearBindgen
class Token {
  constructor(
    public id: string,
    public owner_id: string,
    public metadata: TokenMetadata
  ) {}
}

const tokens = new PersistentMap<string, Token>("t");
const tokensByOwner = new PersistentMap<string, string[]>("to");

export function nft_mint(
  token_id: string,
  metadata: TokenMetadata,
  receiver_id: string = context.sender
): void {
  // Make sure the token doesn't already exist
  assert(!tokens.contains(token_id), "Token already exists");

  // Create the token
  const token = new Token(token_id, receiver_id, metadata);
  tokens.set(token_id, token);

  // Add to owner's tokens
  let ownerTokens = tokensByOwner.get(receiver_id, []);
  ownerTokens.push(token_id);
  tokensByOwner.set(receiver_id, ownerTokens);

  logging.log(`Minted token ${token_id} for ${receiver_id}`);
}

export function nft_token(token_id: string): Token | null {
  return tokens.get(token_id);
}

export function nft_tokens_for_owner(
  account_id: string,
  from_index: string = "0",
  limit: i32 = 50
): Token[] {
  const ownerTokens = tokensByOwner.get(account_id, []);
  const start = parseInt(from_index);
  const end = min(start + limit, ownerTokens.length);
  
  const result: Token[] = [];
  for (let i = start; i < end; i++) {
    const token = tokens.get(ownerTokens[i]);
    if (token) {
      result.push(token);
    }
  }
  
  return result;
}

function min(a: i32, b: i32): i32 {
  return a < b ? a : b;
} 