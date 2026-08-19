import { Schema } from "effect";

import {
  BoundedString,
  IsoDateTimeSchema,
  PrivacyTierSchema,
} from "./primitives.js";

/** Pointer to external provenance — path, URL, or opaque id. */
export const ReceiptRefSchema = Schema.Struct({
  label: BoundedString,
  href: Schema.optional(Schema.String),
  kind: Schema.optional(Schema.String),
});
export type ReceiptRef = typeof ReceiptRefSchema.Type;

export const XPostMetricsSchema = Schema.Struct({
  impressionCount: Schema.optional(Schema.Number),
  likeCount: Schema.optional(Schema.Number),
  replyCount: Schema.optional(Schema.Number),
  quoteCount: Schema.optional(Schema.Number),
  bookmarkCount: Schema.optional(Schema.Number),
});

const receiptBase = {
  id: Schema.String,
  occurredAt: IsoDateTimeSchema,
  privacy: PrivacyTierSchema,
  title: BoundedString,
  summary: BoundedString,
  indexText: BoundedString,
  refs: Schema.Array(ReceiptRefSchema),
  slurpedAt: IsoDateTimeSchema,
} as const;

/**
 * Discriminated union — `_tag` for exhaustiveness; `source` mirrors tag for search filters.
 * Adapters map external data → one variant; ReceiptStore persists the union.
 */
export const ContextReceiptSchema = Schema.TaggedUnion({
  Brain: {
    ...receiptBase,
    source: Schema.Literal("brain"),
    path: Schema.String,
    brainRoot: Schema.optional(Schema.String),
  },
  XPost: {
    ...receiptBase,
    source: Schema.Literal("x_post"),
    tweetId: Schema.String,
    authorHandle: Schema.optional(Schema.String),
    metrics: Schema.optional(XPostMetricsSchema),
  },
  AgentSession: {
    ...receiptBase,
    source: Schema.Literal("agent_session"),
    sessionId: Schema.String,
    agent: Schema.optional(Schema.String),
    machine: Schema.optional(Schema.String),
    excerpt: BoundedString,
  },
  GmailThread: {
    ...receiptBase,
    source: Schema.Literal("gmail_thread"),
    threadId: Schema.String,
    account: Schema.String,
  },
  SlackMessage: {
    ...receiptBase,
    source: Schema.Literal("slack_message"),
    channelId: Schema.String,
    messageTs: Schema.String,
    permalink: Schema.optional(Schema.String),
  },
  GranolaMeeting: {
    ...receiptBase,
    source: Schema.Literal("granola_meeting"),
    meetingId: Schema.String,
  },
  GitActivity: {
    ...receiptBase,
    source: Schema.Literal("git_activity"),
    repo: Schema.String,
    revision: Schema.String,
    activityKind: Schema.Union([
      Schema.Literal("commit"),
      Schema.Literal("merge"),
      Schema.Literal("deploy"),
      Schema.Literal("tag"),
    ]),
  },
});
export type ContextReceipt = typeof ContextReceiptSchema.Type;

export const decodeContextReceipt =
  Schema.decodeUnknownSync(ContextReceiptSchema);
export const encodeContextReceipt = Schema.encodeSync(ContextReceiptSchema);
