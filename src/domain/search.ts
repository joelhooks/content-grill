import { Schema } from "effect";

import { PrivacyTierSchema } from "./primitives.js";
import { ContextReceiptSchema } from "./receipt.js";

export const SearchQuerySchema = Schema.Struct({
  query: Schema.String,
  since: Schema.optional(Schema.String),
  limit: Schema.optional(Schema.Number),
  includePrivacy: Schema.optional(Schema.Array(PrivacyTierSchema)),
});
export type SearchQuery = typeof SearchQuerySchema.Type;

export const SearchHitSchema = Schema.Struct({
  receipt: ContextReceiptSchema,
  score: Schema.Number,
});
export type SearchHit = typeof SearchHitSchema.Type;

export const SearchResultSchema = Schema.Struct({
  query: SearchQuerySchema,
  hits: Schema.Array(SearchHitSchema),
  elapsedMs: Schema.Number,
});
export type SearchResult = typeof SearchResultSchema.Type;

export const RecentQuerySchema = Schema.Struct({
  since: Schema.String,
  limit: Schema.optional(Schema.Number),
  includePrivacy: Schema.optional(Schema.Array(PrivacyTierSchema)),
});
export type RecentQuery = typeof RecentQuerySchema.Type;

export const decodeSearchResult = Schema.decodeUnknownSync(SearchResultSchema);
