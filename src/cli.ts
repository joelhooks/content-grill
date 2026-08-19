#!/usr/bin/env node

import { existsSync } from "node:fs";

import { Effect } from "effect";

import {
  type ConfigLoadError,
  defaultConfigPath,
  ensureDataDir,
  loadConfig,
  toConfigDoctorView,
} from "./config/load.js";
import type {
  DoctorResult,
  FailureEnvelopeSchema,
  SuccessEnvelopeSchema,
} from "./domain/envelope.js";

const VERSION = "0.0.0";

type CliEnvelope =
  | typeof SuccessEnvelopeSchema.Type
  | typeof FailureEnvelopeSchema.Type;

const printJson = (value: CliEnvelope): void => {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
};

const reportFatal = (error: Error): never => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
};

const usage = (): void => {
  process.stderr.write(`content-grill ${VERSION}

Usage:
  content-grill doctor
  content-grill config show
  content-grill slurp status
  content-grill slurp run [--source brain|x_post]
  content-grill context search <query>
  content-grill context recent [--since 24h]

Config: ~/.config/content-grill/config.json (or $CONTENT_GRILL_CONFIG)
See config.example.json. Env overrides file. Tokens stay in the environment.
`);
};

const configFailure = (
  command: string,
  error: ConfigLoadError
): CliEnvelope => ({
  ok: false,
  command,
  result: null,
  error: { code: "config_load_failed", message: error.message },
  fix: "Fix ~/.config/content-grill/config.json or env overrides. See config.example.json.",
  next_actions: [
    {
      command: "content-grill config show",
      description: "Retry after fixing config",
    },
  ],
});

const runDoctor = (): Effect.Effect<CliEnvelope, ConfigLoadError> =>
  Effect.gen(function* () {
    const filePath = defaultConfigPath();
    const config = yield* loadConfig(filePath);
    yield* ensureDataDir(config.dataDir);
    const view = toConfigDoctorView(config, existsSync(filePath));
    const result: DoctorResult = {
      version: VERSION,
      storeReady: false,
      config: view,
      slurpers: [
        { source: "brain", status: "disabled" },
        { source: "x_post", status: "disabled" },
      ],
    };
    return {
      ok: true as const,
      command: "content-grill doctor",
      result,
      next_actions: [
        {
          command: "content-grill config show",
          description: "Print resolved config (no secrets)",
        },
        {
          command: "cp config.example.json ~/.config/content-grill/config.json",
          description: "Seed operator config if missing",
        },
      ],
    };
  });

const runConfigShow = (): Effect.Effect<CliEnvelope, ConfigLoadError> =>
  Effect.gen(function* () {
    const filePath = defaultConfigPath();
    const config = yield* loadConfig(filePath);
    return {
      ok: true as const,
      command: "content-grill config show",
      result: toConfigDoctorView(config, existsSync(filePath)),
      next_actions: [],
    };
  });

const [command, ...rest] = process.argv.slice(2);

try {
  if (
    command === undefined ||
    command === "" ||
    command === "--help" ||
    command === "-h"
  ) {
    usage();
  } else if (command === "doctor") {
    const envelope = await Effect.runPromise(
      runDoctor().pipe(
        Effect.match({
          onFailure: (error) => configFailure("content-grill doctor", error),
          onSuccess: (value) => value,
        })
      )
    );
    printJson(envelope);
  } else if (command === "config" && rest[0] === "show") {
    const envelope = await Effect.runPromise(
      runConfigShow().pipe(
        Effect.match({
          onFailure: (error) =>
            configFailure("content-grill config show", error),
          onSuccess: (value) => value,
        })
      )
    );
    printJson(envelope);
  } else if (command === "slurp" && rest[0] === "status") {
    printJson({
      ok: true,
      command: "content-grill slurp status",
      result: { cursors: [] },
      next_actions: [],
    });
  } else {
    usage();
  }
} catch (error) {
  reportFatal(error instanceof Error ? error : new Error(String(error)));
}
