# Vision

Content Grill is a context plane and topic spar for creative work. It slurps receipts from Brain, X, agent sessions, and later inbox, Slack, and Granola into a fast local index. Agents use that index to name topics worth digging into. They do not write tweets, scripts, or posts.

Scope: this repository — CLI, schemas, slurpers, and the content-grill skill.

Audience: operators running the CLI, agents composing grill skills, maintainers adding slurpers or query backends.

## Who we serve

- Operators — sparring partner from real work, not a ghostwriter
- Agents running `grill-me` / `grill-with-docs` with slurped context
- Maintainers adding adapters without rewiring domain schemas

Not for: growth automation, auto-posting, engagement pods, content calendar bots.

## Why it exists

Work lives across Brain, repos, sessions, X, email, and Slack. Query-time hunting is slow and inconsistent. Content Grill pre-slurps, validates, and indexes activity so a grill session starts from receipts.

The grill names dig-deeper topics. The operator writes the words.

## Outcomes

1. `context search` / `context recent` return in under 2s on the configured host for v1 sources (Brain + X archive).
2. Every boundary is Effect Schema — receipts, slurp state, CLI envelopes, topic prompts, operator config.
3. Hexagonal seams hold — domain never imports OAuth, filesystem, or SQL.
4. Privacy tiers enforced at slurp — operator context stays out of default agent queries.
5. Grill output is topic-only — `TopicPromptBatch.generatesCopy` is always `false`.

## Priorities

1. Storage + scheduler on the configured host (~5-minute slurp cadence from config).
2. v1 slurpers: Brain index + X timeline archive.
3. CLI: `doctor`, `config show`, `slurp`, `context search|recent` with jc-slack-style JSON.
4. Skill wiring for grill-master / grill-me / grill-with-docs.
5. v2 sources: inbox, Granola, Slack stream — after v1 is boring.

## Actors

- Beneficiary: the operator running content grill
- Builders: agents and humans on adapters and schemas
- External systems (adapters only): secret stores, X API, Brain, mail CLI, Slack tooling, meeting transcripts

This tool does not publish to X, YouTube, or customers.

## Merge without asking

- Schema additions that keep existing variants and privacy rules
- Adapters behind existing ports
- Domain decode/encode tests
- Docs, skill wording, `doctor` diagnostics
- Bug fixes with bounded blast radius and receipts

## Needs sign-off

- Generated publishable copy in CLI or skill paths
- Privacy tier semantics or default query changes
- Full email, Slack, or transcript bodies beyond bounded receipt summaries
- New slurpers touching customer, client, or secret-adjacent data
- Public indexing of plane contents
- Auth or deployment changes on the production scheduler host

## Not now

- Auto-post to X or YouTube
- Draft tweets, threads, scripts, titles, thumbnails, SEO copy
- Engagement optimization, pods, algo-gaming automation
- Slack socket ingest before v1 brain + X slurpers work
- Cross-machine plane replication (single-host v1)

## Evidence of progress

- `doctor` shows resolved config, fresh slurp cursors, and search latency
- Agents run content grill without manual Brain/X hunting
- Operator gets three dig-deeper topics with receipt links and writes zero agent-drafted posts from the tool

## Amendments

Propose amendments with receipts in [`.brain/projects/content-grill/content-grill-brief.svx`](./.brain/projects/content-grill/content-grill-brief.svx).
