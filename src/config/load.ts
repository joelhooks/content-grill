import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

import { Effect, Schema } from "effect";

import {
  type ConfigDoctorView,
  type ContentGrillConfig,
  type ContentGrillConfigFile,
  ContentGrillConfigFileSchema,
  ContentGrillConfigSchema,
  DEFAULT_V1_SOURCES,
} from "../domain/config.js";
import { DEFAULT_QUERY_PRIVACY } from "../domain/primitives.js";

const ENV_CONFIG_PATH = "CONTENT_GRILL_CONFIG";
const ENV_DATA_DIR = "CONTENT_GRILL_DATA_DIR";
const ENV_BRAIN_ROOTS = "CONTENT_GRILL_BRAIN_ROOTS";
const ENV_SLURP_HOST = "CONTENT_GRILL_SLURP_HOST";
const ENV_SLURP_INTERVAL = "CONTENT_GRILL_SLURP_INTERVAL_SECONDS";
const ENV_SEARCH_BUDGET = "CONTENT_GRILL_SEARCH_LATENCY_MS_BUDGET";
const ENV_X_HANDLE = "CONTENT_GRILL_X_HANDLE";
const ENV_X_OAUTH_PREFIX = "CONTENT_GRILL_X_OAUTH_ENV_PREFIX";
const ENV_GMAIL_MAILBOX = "CONTENT_GRILL_GMAIL_MAILBOX";

export class ConfigLoadError extends Schema.TaggedError<ConfigLoadError>()(
  "ConfigLoadError",
  {
    message: Schema.String,
    cause: Schema.optionalKey(Schema.Defect()),
  }
) {}

/** `$CONTENT_GRILL_CONFIG` or `~/.config/content-grill/config.json`. */
export const defaultConfigPath = (): string => {
  const fromEnv = process.env[ENV_CONFIG_PATH];
  if (fromEnv !== undefined && fromEnv !== "") {
    return fromEnv;
  }
  return path.join(homedir(), ".config", "content-grill", "config.json");
};

/** `$CONTENT_GRILL_DATA_DIR` or `~/.local/share/content-grill`. */
export const defaultDataDir = (): string => {
  const fromEnv = process.env[ENV_DATA_DIR];
  if (fromEnv !== undefined && fromEnv !== "") {
    return fromEnv;
  }
  return path.join(homedir(), ".local", "share", "content-grill");
};

const nonEmptyEnv = (key: string): string | undefined => {
  const raw = process.env[key];
  if (raw === undefined || raw === "") {
    return undefined;
  }
  return raw;
};

const parseBrainRootsEnv = (
  raw: string | undefined
): readonly string[] | undefined => {
  if (raw === undefined) {
    return undefined;
  }
  return raw
    .split(":")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
};

const parsePositiveIntEnv = (raw: string | undefined): number | undefined => {
  if (raw === undefined) {
    return undefined;
  }
  const n = Math.trunc(Number(raw));
  if (!Number.isFinite(n) || n <= 0) {
    return undefined;
  }
  return n;
};

const readConfigFile = (
  filePath: string
): Effect.Effect<ContentGrillConfigFile | undefined, ConfigLoadError> =>
  Effect.try({
    try: (): ContentGrillConfigFile | undefined => {
      if (!existsSync(filePath)) {
        return undefined;
      }
      const raw: unknown = JSON.parse(readFileSync(filePath, "utf-8"));
      return Schema.decodeUnknownSync(ContentGrillConfigFileSchema)(raw);
    },
    catch: (cause) =>
      new ConfigLoadError({
        message: `Failed to read or decode config at ${filePath}`,
        cause,
      }),
  });

const pickString = (
  envValue: string | undefined,
  fileValue: string | undefined,
  fallback: string
): string => envValue ?? fileValue ?? fallback;

const pickNumber = (
  envValue: number | undefined,
  fileValue: number | undefined,
  fallback: number
): number => envValue ?? fileValue ?? fallback;

interface XPostResolved {
  enabled: boolean;
  handle?: string;
  oauthEnvPrefix?: string;
}

interface GmailResolved {
  enabled: boolean;
  mailbox?: string;
}

const buildXPost = (
  file: ContentGrillConfigFile | undefined
): XPostResolved => {
  const resolved: XPostResolved = {
    enabled: file?.sources?.x_post?.enabled ?? true,
  };
  const handle = nonEmptyEnv(ENV_X_HANDLE) ?? file?.sources?.x_post?.handle;
  if (handle !== undefined) {
    resolved.handle = handle;
  }
  const oauthEnvPrefix =
    nonEmptyEnv(ENV_X_OAUTH_PREFIX) ?? file?.sources?.x_post?.oauthEnvPrefix;
  if (oauthEnvPrefix !== undefined) {
    resolved.oauthEnvPrefix = oauthEnvPrefix;
  }
  return resolved;
};

const buildGmail = (
  file: ContentGrillConfigFile | undefined
): GmailResolved => {
  const resolved: GmailResolved = {
    enabled: file?.sources?.gmail?.enabled ?? false,
  };
  const mailbox =
    nonEmptyEnv(ENV_GMAIL_MAILBOX) ?? file?.sources?.gmail?.mailbox;
  if (mailbox !== undefined) {
    resolved.mailbox = mailbox;
  }
  return resolved;
};

/**
 * Resolve operator config: defaults < file < env.
 * Tokens stay in the environment — only prefixes/handles land in config.
 */
export const loadConfig = (
  configPath = defaultConfigPath()
): Effect.Effect<ContentGrillConfig, ConfigLoadError> =>
  Effect.gen(function* () {
    const file = yield* readConfigFile(configPath);
    const resolved = {
      version: 1 as const,
      configPath,
      dataDir: pickString(
        nonEmptyEnv(ENV_DATA_DIR),
        file?.dataDir,
        defaultDataDir()
      ),
      brainRoots: [
        ...(parseBrainRootsEnv(nonEmptyEnv(ENV_BRAIN_ROOTS)) ??
          file?.brainRoots ??
          []),
      ],
      slurpHost: pickString(
        nonEmptyEnv(ENV_SLURP_HOST),
        file?.slurpHost,
        "localhost"
      ),
      slurpIntervalSeconds: pickNumber(
        parsePositiveIntEnv(nonEmptyEnv(ENV_SLURP_INTERVAL)),
        file?.slurpIntervalSeconds,
        300
      ),
      searchLatencyMsBudget: pickNumber(
        parsePositiveIntEnv(nonEmptyEnv(ENV_SEARCH_BUDGET)),
        file?.searchLatencyMsBudget,
        2000
      ),
      sources: {
        brain: {
          enabled: file?.sources?.brain?.enabled ?? true,
        },
        x_post: buildXPost(file),
        gmail: buildGmail(file),
      },
      defaultQueryPrivacy: [
        ...(file?.defaultQueryPrivacy ?? DEFAULT_QUERY_PRIVACY),
      ],
      v1Sources: [...DEFAULT_V1_SOURCES],
    };

    return yield* Effect.try({
      try: () => Schema.decodeUnknownSync(ContentGrillConfigSchema)(resolved),
      catch: (cause) =>
        new ConfigLoadError({
          message: "Resolved config failed schema validation",
          cause,
        }),
    });
  });

/** Public doctor fields — never include token values. */
export const toConfigDoctorView = (
  config: ContentGrillConfig,
  configFilePresent: boolean
): ConfigDoctorView => ({
  configPath: config.configPath,
  configFilePresent,
  dataDir: config.dataDir,
  brainRoots: [...config.brainRoots],
  slurpHost: config.slurpHost,
  slurpIntervalSeconds: config.slurpIntervalSeconds,
  searchLatencyMsBudget: config.searchLatencyMsBudget,
  sources: {
    brainEnabled: config.sources.brain.enabled,
    xEnabled: config.sources.x_post.enabled,
    xHandleSet: config.sources.x_post.handle !== undefined,
    xOauthEnvPrefixSet: config.sources.x_post.oauthEnvPrefix !== undefined,
    gmailEnabled: config.sources.gmail.enabled,
    gmailMailboxSet: config.sources.gmail.mailbox !== undefined,
  },
  defaultQueryPrivacy: [...config.defaultQueryPrivacy],
  v1Sources: [...config.v1Sources],
});

/** Ensure data dir exists (idempotent). */
export const ensureDataDir = (
  dataDir: string
): Effect.Effect<void, ConfigLoadError> =>
  Effect.try({
    try: () => {
      mkdirSync(dataDir, { recursive: true });
    },
    catch: (cause) =>
      new ConfigLoadError({
        message: `Failed to create dataDir ${dataDir}`,
        cause,
      }),
  });
