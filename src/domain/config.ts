import { Schema } from "effect";

import { PrivacyTierSchema, V1_SOURCE_KINDS } from "./primitives.js";

/**
 * On-disk / env config for one operator install.
 * Paths and hostnames live here — never hardcode them in the repo.
 */
export const ContentGrillConfigFileSchema = Schema.Struct({
  version: Schema.optionalKey(Schema.Literal(1)),
  /** Absolute path for the local context plane store. */
  dataDir: Schema.optionalKey(Schema.String),
  /** Brain trees to slurp (absolute paths). */
  brainRoots: Schema.optionalKey(Schema.Array(Schema.String)),
  /** Hostname (or label) where the slurp scheduler runs. */
  slurpHost: Schema.optionalKey(Schema.String),
  /** Slurp cadence in seconds. */
  slurpIntervalSeconds: Schema.optionalKey(Schema.Number),
  /** Soft budget for `context search` p50 latency checks. */
  searchLatencyMsBudget: Schema.optionalKey(Schema.Number),
  sources: Schema.optionalKey(
    Schema.Struct({
      brain: Schema.optionalKey(
        Schema.Struct({
          enabled: Schema.optionalKey(Schema.Boolean),
        })
      ),
      x_post: Schema.optionalKey(
        Schema.Struct({
          enabled: Schema.optionalKey(Schema.Boolean),
          /** X handle without @. Auth via env / secrets manager — not this file. */
          handle: Schema.optionalKey(Schema.String),
          /** Env var prefix for OAuth tokens (e.g. `x_yourhandle`). */
          oauthEnvPrefix: Schema.optionalKey(Schema.String),
        })
      ),
      gmail: Schema.optionalKey(
        Schema.Struct({
          enabled: Schema.optionalKey(Schema.Boolean),
          mailbox: Schema.optionalKey(Schema.String),
        })
      ),
    })
  ),
  /** Default privacy tiers for agent queries. */
  defaultQueryPrivacy: Schema.optionalKey(Schema.Array(PrivacyTierSchema)),
});
export type ContentGrillConfigFile = typeof ContentGrillConfigFileSchema.Type;

/** Fully resolved config after defaults + env overlay. */
export const ContentGrillConfigSchema = Schema.Struct({
  version: Schema.Literal(1),
  configPath: Schema.String,
  dataDir: Schema.String,
  brainRoots: Schema.Array(Schema.String),
  slurpHost: Schema.String,
  slurpIntervalSeconds: Schema.Number,
  searchLatencyMsBudget: Schema.Number,
  sources: Schema.Struct({
    brain: Schema.Struct({
      enabled: Schema.Boolean,
    }),
    x_post: Schema.Struct({
      enabled: Schema.Boolean,
      handle: Schema.optionalKey(Schema.String),
      oauthEnvPrefix: Schema.optionalKey(Schema.String),
    }),
    gmail: Schema.Struct({
      enabled: Schema.Boolean,
      mailbox: Schema.optionalKey(Schema.String),
    }),
  }),
  defaultQueryPrivacy: Schema.Array(PrivacyTierSchema),
  v1Sources: Schema.Array(Schema.String),
});
export type ContentGrillConfig = typeof ContentGrillConfigSchema.Type;

/** Safe doctor surface — no secret values. */
export const ConfigDoctorViewSchema = Schema.Struct({
  configPath: Schema.String,
  configFilePresent: Schema.Boolean,
  dataDir: Schema.String,
  brainRoots: Schema.Array(Schema.String),
  slurpHost: Schema.String,
  slurpIntervalSeconds: Schema.Number,
  searchLatencyMsBudget: Schema.Number,
  sources: Schema.Struct({
    brainEnabled: Schema.Boolean,
    xEnabled: Schema.Boolean,
    xHandleSet: Schema.Boolean,
    xOauthEnvPrefixSet: Schema.Boolean,
    gmailEnabled: Schema.Boolean,
    gmailMailboxSet: Schema.Boolean,
  }),
  defaultQueryPrivacy: Schema.Array(PrivacyTierSchema),
  v1Sources: Schema.Array(Schema.String),
});
export type ConfigDoctorView = typeof ConfigDoctorViewSchema.Type;

export const DEFAULT_V1_SOURCES = [...V1_SOURCE_KINDS];
