import { Schema } from "effect";

/** Who may see a receipt in default query paths. Redact in adapters before write. */
export const PrivacyTierSchema = Schema.Union([
  Schema.Literal("operator"),
  Schema.Literal("work"),
  Schema.Literal("public"),
]);
export type PrivacyTier = typeof PrivacyTierSchema.Type;

/** Default query surface: work + public. Operator requires explicit CLI flag. */
export const DEFAULT_QUERY_PRIVACY = [
  "work",
  "public",
] as const satisfies readonly PrivacyTier[];

/** Slurper identity — aligns with receipt union tags in v1/v2. */
export const SourceKindSchema = Schema.Union([
  Schema.Literal("brain"),
  Schema.Literal("x_post"),
  Schema.Literal("agent_session"),
  Schema.Literal("gmail_thread"),
  Schema.Literal("slack_message"),
  Schema.Literal("granola_meeting"),
  Schema.Literal("git_activity"),
]);
export type SourceKind = typeof SourceKindSchema.Type;

/** v1 slurpers only. */
export const V1_SOURCE_KINDS = [
  "brain",
  "x_post",
] as const satisfies readonly SourceKind[];

export const MAX_SUMMARY_CHARS = 500;
export const MAX_INDEX_TEXT_CHARS = 4_000;
export const MAX_TITLE_CHARS = 200;
export const MAX_RECEIPT_REF_LABEL_CHARS = 120;

/** Bounded in adapters today; length filters land in a follow-up schema pass. */
export const BoundedString = Schema.String;

export const IsoDateTimeSchema = Schema.String;
