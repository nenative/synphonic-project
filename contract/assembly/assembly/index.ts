import { Context, PersistentMap, storage, logging } from "near-sdk-as";

class Token {
  constructor(
    public owner_id: string,
    public title: string,
    public description: string,
    public media: string,
    public extra: Map<string, string> = new Map<string, string>()
  ) {}
}

export class Contract {
  private tokens: PersistentMap<string, Token>;
  private token_metadata: PersistentMap<string, Map<string, string>>;

  constructor() {
    this.tokens = new PersistentMap<string, Token>("t");
    this.token_metadata = new PersistentMap<string, Map<string, string>>("m");
  }

  mint(token_id: string, title: string, description: string, media: string): void {
    if (this.tokens.contains(token_id)) {
      logging.log("Token already exists");
      return;
    }
    const token = new Token(Context.sender, title, description, media);
    this.tokens.set(token_id, token);
  }

  get_token(token_id: string): Token | null {
    return this.tokens.get(token_id);
  }

  get_tokens_by_owner(account_id: string): Token[] {
    const result: Token[] = [];
    const token = this.tokens.get(account_id);
    if (token && token.owner_id === account_id) {
      result.push(token);
    }
    return result;
  }

  total_supply(): i32 {
    let count: i32 = 0;
    // Iterate through all tokens to count them
    const token_ids = storage.keys("t");
    for (let i = 0; i < token_ids.length; i++) {
      count++;
    }
    return count;
  }
} 