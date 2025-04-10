import { Context, storage, logging, PersistentMap, ContractPromiseBatch } from "near-sdk-as";
import { TokenMetadata, Token } from "./model";

// Define the decorators manually since they're not exported directly
function nearBindgen(target: any) {
    return target;
}

function view(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    return descriptor;
}

function payable(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    return descriptor;
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

@nearBindgen
export class Token {
    id: string;
    owner_id: string;
    metadata: TokenMetadata;

    constructor(id: string, owner_id: string, metadata: TokenMetadata) {
        this.id = id;
        this.owner_id = owner_id;
        this.metadata = metadata;
    }
}

@nearBindgen
export class Contract {
    private tokensByOwner: PersistentMap<string, string[]>;
    private tokens: PersistentMap<string, Token>;
    private owner_id: string;

    constructor() {
        this.tokensByOwner = new PersistentMap<string, string[]>("tbo");
        this.tokens = new PersistentMap<string, Token>("t");
        this.owner_id = Context.sender;
    }

    @view
    nft_total_supply(): i32 {
        let count = 0;
        let tokens = storage.get<string[]>("all_tokens");
        if (tokens) {
            count = tokens.length;
        }
        return count;
    }

    @view
    nft_token(token_id: string): Token | null {
        return this.tokens.get(token_id);
    }

    @view
    nft_tokens_for_owner(account_id: string): Token[] {
        const tokens: Token[] = [];
        const tokenIds = this.tokensByOwner.get(account_id);
        if (tokenIds) {
            for (let i = 0; i < tokenIds.length; i++) {
                const token = this.tokens.get(tokenIds[i]);
                if (token) {
                    tokens.push(token);
                }
            }
        }
        return tokens;
    }

    @payable
    nft_mint(token_id: string, metadata: TokenMetadata): Token {
        assert(Context.sender == this.owner_id, "Only owner can mint");
        assert(!this.tokens.contains(token_id), "Token already exists");

        const token = new Token(token_id, Context.sender, metadata);
        this.tokens.set(token_id, token);

        // Update owner's token list
        let ownerTokens = this.tokensByOwner.get(Context.sender);
        if (!ownerTokens) {
            ownerTokens = [];
        }
        ownerTokens.push(token_id);
        this.tokensByOwner.set(Context.sender, ownerTokens);

        // Update all tokens list
        let allTokens = storage.get<string[]>("all_tokens");
        if (!allTokens) {
            allTokens = [];
        }
        allTokens.push(token_id);
        storage.set("all_tokens", allTokens);

        return token;
    }
}

// Initialize the contract
const contract = new Contract(); 