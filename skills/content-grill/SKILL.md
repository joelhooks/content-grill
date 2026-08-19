---
name: content-grill
displayName: Content Grill
description: Slurp work/progress context and run topic grills — brainstorm dig-deeper angles from Brain, X, sessions, and more. Never generates tweet or video copy. Use when asked for content topics, content grill, or what to dig into from recent work.
version: 0.0.0
author: content-grill
tags:
  - content
  - grill
  - brain
  - x
disable-model-invocation: true
---

# Content Grill

Topic sparring partner — **not** a ghostwriter.

## Hard rule

Output **topic prompts** only (`TopicPrompt`: title, why-now, receipt refs, one dig-deeper question). **`generatesCopy` is always false.** Do not draft tweets, scripts, titles, or posts.

## Composition

1. Load `grill-master` / `grill-me` / `grill-with-docs` for the HITL spar.
2. Query context via `content-grill` CLI (when wired):

```bash
content-grill context recent --since 24h
content-grill context search "effect schema"
content-grill doctor
```

3. Present **3 dig-deeper topics** with receipts. One question at a time in the spar.

## Privacy

Default queries: `work` + `public` only. Never surface `operator` tier unless the operator explicitly requests operator mode.

## v1 sources

`brain`, `x_post` — others schema-reserved.

## Repo

Planning brief: `.brain/projects/content-grill/` in the repo.

Read `VISION.md` and `AGENTS.md` before substantial work.
