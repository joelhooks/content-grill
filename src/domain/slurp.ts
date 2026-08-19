import { Schema } from "effect";

import { IsoDateTimeSchema, SourceKindSchema } from "./primitives.js";

export const SlurpRunStatusSchema = Schema.Union([
  Schema.Literal("idle"),
  Schema.Literal("syncing"),
  Schema.Literal("fresh"),
  Schema.Literal("failed"),
  Schema.Literal("disabled"),
]);
export type SlurpRunStatus = typeof SlurpRunStatusSchema.Type;

/** Per-source watermark persisted between slurp runs. */
export const SlurpCursorSchema = Schema.Struct({
  source: SourceKindSchema,
  cursor: Schema.optional(Schema.String),
  lastSuccessAt: Schema.optional(IsoDateTimeSchema),
  lastAttemptAt: Schema.optional(IsoDateTimeSchema),
  lastError: Schema.optional(Schema.String),
  status: SlurpRunStatusSchema,
});
export type SlurpCursor = typeof SlurpCursorSchema.Type;

/** One slurp execution record. */
export const SlurpRunSchema = Schema.Struct({
  runId: Schema.String,
  source: SourceKindSchema,
  startedAt: IsoDateTimeSchema,
  finishedAt: Schema.optional(IsoDateTimeSchema),
  status: SlurpRunStatusSchema,
  receiptsUpserted: Schema.Number,
  receiptsSkipped: Schema.Number,
  error: Schema.optional(Schema.String),
});
export type SlurpRun = typeof SlurpRunSchema.Type;

export const SlurpResultSchema = Schema.Struct({
  run: SlurpRunSchema,
  cursor: SlurpCursorSchema,
});
export type SlurpResult = typeof SlurpResultSchema.Type;

export const decodeSlurpCursor = Schema.decodeUnknownSync(SlurpCursorSchema);
export const decodeSlurpResult = Schema.decodeUnknownSync(SlurpResultSchema);
