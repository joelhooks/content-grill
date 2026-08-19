# content-grill — Pi append

Read [`AGENTS.md`](../AGENTS.md) and [`VISION.md`](../VISION.md) first.

This repo is a **schema-first context plane** for topic grilling — not content generation.

When working here:

- Domain schemas live in `src/domain/`; extend the `ContextReceipt` TaggedUnion for new sources.
- Ports in `src/ports/` — adapters must redact to `PrivacyTier` before write.
- Skill: `skills/content-grill/SKILL.md` — compose grill-me for HITL spar; output topics only.
- Planning brief: `.brain/projects/content-grill/`
- Config: `~/.config/content-grill/config.json` + `CONTENT_GRILL_*` env (see `config.example.json`).
- Source mirrors: run `./scripts/vendor-agent-sources.sh` then read `.agent_sources/github.com/Effect-TS/effect`, `kitlangton/effect-solutions`, and `statelyai/xstate` before Effect/XState edits.

Run `npm run check` before claiming done.
