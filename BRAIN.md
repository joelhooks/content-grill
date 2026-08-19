# content-grill brain

Agent-connected project brain. Not a notes site.

- Organize by usefulness: Projects, Areas, Resources, Archives.
- Capture durable decisions, schema tradeoffs, adapter receipts, and privacy boundaries.
- Express knowledge as code, docs, and plans. Storage is not the goal; output is.
- Repo-local notes live in `.brain/**/*.svx`. Planning brief: `.brain/projects/content-grill/`.
- Browser pages are read/review surfaces. Agents own source edits and must leave receipts.

## Unslop (standing law for Brain and docs)

Brain notes and human-facing docs in this repo follow unslop. The principles live here. You do not need a slash command.

**Before you ship prose a human will read:**

1. Keep the facts, sources, and useful rough edges. Cut language that sounds generated.
2. Replace vague or inflated claims with the concrete fact, source, or number.
3. Remove filler, repeated structure, and chatbot throat-clearing.
4. Keep an opinion when the evidence supports it. Do not fake neutrality.
5. Read once as a tired human. Cut anything that still sounds like a model explaining how helpful it is.

**Remove these tells:**

- Significance inflation: "pivotal moment", "testament to", "evolving landscape", "setting the stage".
- Promotional adjectives: "groundbreaking", "seamless", "best-in-class", "vibrant".
- Vague attributions without a named source: "experts believe", "industry reports suggest".
- AI vocabulary when plain words work: "additionally", "crucial", "delve", "fostering", "landscape", "showcase", "underscore".
- Copula avoidance: prefer "is" and "has" over "serves as", "stands as", "boasts", "features".
- Forced rule-of-three lists, synonym cycling, and fake ranges ("from X to Y") when the scale is not real.
- Em-dash chains, mid-sentence colons as glue, bold labels that repeat the next sentence, Title Case headings for ordinary sections.
- Agent filler: "I hope this helps", "let me know if", sycophancy, excessive hedging, generic conclusions.

**Voice:**

- Plain words. One claim per sentence. Concrete numbers over adjectives.
- Do not invent experience, opinions, anecdotes, or metrics.
- Do not remove uncertainty the evidence requires. Do not strengthen an unsourced claim because it reads better.

**Safety:**

- Uncertainty stays when the evidence requires it.
- Public docs never carry secrets, tokens, private hostnames, or customer-identifying detail.
