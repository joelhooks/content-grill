# Upstream and related work

## anti-slop (Oxlint plugin)

Vendored from [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop) commit `6d538555cb151d4121ed51a27db81890eacf8ae9`.

Dillon Mulroy's plugin catches code that discards evidence at boundaries: broad `unknown`, unsafe dictionaries, reflection, module mocks, and assertion chains without invariants.

Install and refresh via the fleet skill at `dark-wizard/skills/anti-slop/` or copy from that vendored `assets/anti-slop/` tree.

## effect-solutions (idiom source)

[kitlangton/effect-solutions](https://github.com/kitlangton/effect-solutions) documents idiomatic Effect v4 patterns: services and layers, Schema modeling, error handling, config, and testing.

This repo vendors effect-solutions under `.agent_sources/` for agent reads. The opt-in Effect rule here (`anti-slop-effect/no-service-constructor-imports`) is one concrete lint derived from that guidance.

**Candidate rules for a future pack** (design only — ground each in effect-solutions before shipping):

| Topic | Lint idea |
| --- | --- |
| Services | Ban importing `make<Service>()` outside tests; require Layer + `yield*` |
| Errors | Prefer `Schema.TaggedError` over plain `Error` subclasses at domain boundaries |
| Config | Config schemas live at the edge; no raw `process.env` reads in domain code |
| Layers | No `Effect.provide` deep inside business logic — compose at the program edge |

Track proposals in `.brain/resources/` when a rule has a test case and a chapter receipt.
