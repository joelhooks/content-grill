import { Schema } from "effect";

import { BoundedString, IsoDateTimeSchema } from "./primitives.js";

export { MAX_SUMMARY_CHARS as TOPIC_WHY_NOW_MAX } from "./primitives.js";

/**
 * Output of a content grill session — topic only, never publishable body copy.
 * Grill skill composes grill-me; this schema is the structured handoff.
 */
export const TopicPromptSchema = Schema.Struct({
  id: Schema.String,
  title: BoundedString,
  whyNow: BoundedString,
  receiptIds: Schema.Array(Schema.String),
  digDeeperQuestion: BoundedString,
  createdAt: IsoDateTimeSchema,
});
export type TopicPrompt = typeof TopicPromptSchema.Type;

export const TopicPromptBatchSchema = Schema.Struct({
  prompts: Schema.Array(TopicPromptSchema),
  /** Explicit guardrail echoed in skill docs. */
  generatesCopy: Schema.Literal(false),
});
export type TopicPromptBatch = typeof TopicPromptBatchSchema.Type;

export const decodeTopicPromptBatch = Schema.decodeUnknownSync(
  TopicPromptBatchSchema
);
