# Agent instructions

Repo law. Read [`VISION.md`](./VISION.md) before substantial work. Pi also loads [`.pi/APPEND_SYSTEM.md`](./.pi/APPEND_SYSTEM.md).

Planning brief: [`.brain/projects/content-grill/content-grill-brief.svx`](./.brain/projects/content-grill/content-grill-brief.svx)

## Topics only

Never generate publishable copy. Output is `TopicPrompt` / `TopicPromptBatch` only (`generatesCopy: false`). No draft tweets, scripts, titles, or post bodies in CLI or skill paths.

## Stack

Pins live in `package.json`. Repo wins; note drift, do not silently migrate.

- Node `>=24`, npm (not Bun)
- Effect `4.0.0-beta.99` + `@effect/platform-node` same pin
- XState `5.32.5`
- TypeScript `7.0.2` Pocock-strict
- Oxlint `1.78.0` + Ultracite + Oxfmt + anti-slop in `tools/oxlint/anti-slop/`
- Lefthook pre-commit: typecheck, lint, format, test

## Operator config

Host paths, handles, and cadence live outside the repo:

- File: `~/.config/content-grill/config.json` (see `config.example.json`)
- Env overrides: `CONTENT_GRILL_*` (see `src/config/load.ts`)
- Tokens: environment / secret store only — never commit them

## Source-first

Before non-trivial Effect or XState edits, read vendored mirrors. Not memory. Not stale docs.

```bash
./scripts/vendor-agent-sources.sh
```

| Need | Path |
| --- | --- |
| Effect Schema, Context.Service | `.agent_sources/github.com/Effect-TS/effect/packages/effect/` |
| platform-node | `.agent_sources/github.com/Effect-TS/effect/packages/platform/node/` |
| Idiomatic Effect | `.agent_sources/github.com/kitlangton/effect-solutions/` |
| XState | `.agent_sources/github.com/statelyai/xstate/packages/core/src/` |
| X ranking | `.agent_sources/github.com/xai-org/x-algorithm/` |

`effect-smol` is archived. V4 is `Effect-TS/effect` only. Inventory: [`.agent_sources/README.md`](./.agent_sources/README.md).

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install lockfile |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run lint` | Ultracite + anti-slop |
| `npm run check` | typecheck + lint + format + test |
| `npx lefthook install` | Git hooks |
| `node --import tsx src/cli.ts doctor` | CLI health + config summary |
| `node --import tsx src/cli.ts config show` | Resolved config (no secrets) |

Run `npm run check` before claiming done.

## Architecture

| Layer    | Path                     | Rule                              |
| -------- | ------------------------ | --------------------------------- |
| Domain   | `src/domain/`            | Effect Schema only; no I/O        |
| Config   | `src/config/`            | Load file + env; schema-validated |
| Ports    | `src/ports/`             | `Context.Service`                 |
| Adapters | `src/adapters/` (future) | Brain, X, store, scheduler        |
| Machines | `src/machines/`          | XState slurp lifecycle            |
| CLI      | `src/cli.ts`             | JSON envelopes                    |

Dependency direction: CLI → ports → domain. Adapters implement ports. Domain does not import adapters.

## Privacy

- Tiers: `operator` | `work` | `public`
- Default queries: work + public
- Adapters redact before write
- No secrets, tokens, or raw email/Slack bodies in the repo or plane dumps

## Source control

Inspect status. Stage task files only. Do not commit `data/`, tokens, or plane dumps.

## Project law

- New boundaries get Effect Schema in `src/domain/`
- Receipts are `ContextReceipt` TaggedUnion variants — new `_tag`, do not flatten
- CLI envelopes: `{ ok, command, result, next_actions }`
- Skill: `skills/content-grill/` — compose `grill-master`, `grill-me`, `grill-with-docs`
- v1 slurpers: `brain`, `x_post` unless brief expands scope

## Sign-off

Safe without asking: schema tests, ports, adapter stubs, docs, skill wording, `doctor`.

Ask before: new slurp sources, storage backend, scheduler deploy, privacy semantic changes, copy generation, publishing plane data.

Evidence: passing tests, `doctor` output, brief ledger update for architecture decisions.
