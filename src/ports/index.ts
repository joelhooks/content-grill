import { Context, Schema } from "effect";
import type { Effect } from "effect";

import type { SourceKind } from "../domain/primitives.js";
import type { ContextReceipt } from "../domain/receipt.js";
import type { SearchHit, SearchQuery } from "../domain/search.js";
import type { SlurpCursor, SlurpResult } from "../domain/slurp.js";

export class ReceiptStoreError extends Schema.TaggedError<ReceiptStoreError>()(
  "ReceiptStoreError",
  {
    operation: Schema.String,
    message: Schema.String,
    cause: Schema.optionalKey(Schema.Defect()),
  }
) {}

/** Port contract — persist and load domain receipts. */
export interface ReceiptStoreApi {
  readonly upsertMany: (
    receipts: readonly ContextReceipt[]
  ) => Effect.Effect<
    { readonly upserted: number; readonly skipped: number },
    ReceiptStoreError
  >;
  readonly getById: (
    id: string
  ) => Effect.Effect<ContextReceipt | undefined, ReceiptStoreError>;
}

/** Port — persist and load domain receipts. Adapters implement (SQLite, etc.). */
export class ReceiptStore extends Context.Service<
  ReceiptStore,
  ReceiptStoreApi
>()("@content-grill/ReceiptStore") {}

export class ContextSearchError extends Schema.TaggedError<ContextSearchError>()(
  "ContextSearchError",
  {
    operation: Schema.String,
    message: Schema.String,
  }
) {}

/** Port contract — query the context plane. */
export interface ContextSearchApi {
  readonly search: (
    query: SearchQuery
  ) => Effect.Effect<readonly SearchHit[], ContextSearchError>;
  readonly recent: (
    sinceIso: string,
    limit: number
  ) => Effect.Effect<readonly SearchHit[], ContextSearchError>;
}

/** Port — query the context plane. */
export class ContextSearch extends Context.Service<
  ContextSearch,
  ContextSearchApi
>()("@content-grill/ContextSearch") {}

export class SlurpSourceError extends Schema.TaggedError<SlurpSourceError>()(
  "SlurpSourceError",
  {
    source: Schema.String,
    message: Schema.String,
    cause: Schema.optionalKey(Schema.Defect()),
  }
) {}

/** Port contract — one slurp source adapter. */
export interface SlurpSourceApi {
  readonly kind: SourceKind;
  readonly slurp: (
    cursor: SlurpCursor
  ) => Effect.Effect<SlurpResult, SlurpSourceError>;
}

/** Port — one slurp source. Each adapter implements for brain, x_post, etc. */
export class SlurpSource extends Context.Service<SlurpSource, SlurpSourceApi>()(
  "@content-grill/SlurpSource"
) {}
