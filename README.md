# content-grill

Local context plane for creative work. Slurp signals from Brain, X, and (later) sessions, inbox, Slack, and Granola. Search in under 2s. Run content grill sessions that name topics worth digging into.

Never generates publishable copy. Topics only.

Docs: [`VISION.md`](./VISION.md) · [`AGENTS.md`](./AGENTS.md) · [`CLAUDE.md`](./CLAUDE.md) · [`.brain/`](./.brain/index.svx) · [`BRAIN.md`](./BRAIN.md)

## Architecture

Hexagonal ports and adapters:

- Domain — Effect Schema in `src/domain/`
- Ports — `ReceiptStore`, `ContextSearch`, `SlurpSource` in `src/ports/`
- Adapters — brain, X, sessions (v1: brain + x_post)
- Machines — XState slurp lifecycle in `src/machines/`
- Config — `~/.config/content-grill/config.json` + env (`config.example.json`)

## CLI (prototype)

```bash
npm install
npm run check
node --import tsx src/cli.ts doctor
node --import tsx src/cli.ts config show
```

Copy [`config.example.json`](./config.example.json) to `~/.config/content-grill/config.json` and set paths for your machine. Env vars override the file. OAuth tokens stay in the environment, never in the config file.

## Privacy

| Tier       | Default query                  |
| ---------- | ------------------------------ |
| `operator` | only with `--include operator` |
| `work`     | yes                            |
| `public`   | yes                            |

Adapters redact before write.

## Planning

[`.brain/projects/content-grill/content-grill-brief.svx`](./.brain/projects/content-grill/content-grill-brief.svx)

## Stack

Effect `4.0.0-rc.110`, XState `5.32.5`, TypeScript `7.0.2`, Node `24+`.

## Credits

- [Dillon Mulroy](https://github.com/dmmulroy) — [anti-slop](https://github.com/dmmulroy/anti-slop) Oxlint rules vendored under `tools/oxlint/anti-slop/`.
- [Kit Langton](https://github.com/kitlangton) — [effect-solutions](https://github.com/kitlangton/effect-solutions) idioms mirrored in `.agent_sources/` and the opt-in Effect lint pack.

Writing discipline for Brain notes and docs: [`BRAIN.md`](./BRAIN.md) (unslop principles embedded there).
