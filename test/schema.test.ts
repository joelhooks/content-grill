import { Schema } from "effect";
import { describe, expect, it } from "vitest";

import { ContextReceiptSchema } from "../src/domain/receipt.js";
import { SlurpCursorSchema } from "../src/domain/slurp.js";
import { TopicPromptBatchSchema } from "../src/domain/topic.js";

describe("domain schemas", () => {
  it("decodes a brain receipt", () => {
    const decoded = Schema.decodeUnknownSync(ContextReceiptSchema)({
      _tag: "Brain",
      id: "brain:projects/content-grill/brief",
      source: "brain",
      occurredAt: "2026-08-19T16:00:00.000Z",
      privacy: "work",
      title: "Content Grill brief chartered",
      summary: "Schema-first context plane for topic brainstorming.",
      indexText: "content grill schema brain brief",
      refs: [
        {
          label: "content-grill-brief.svx",
          href: "file://.brain/projects/content-grill/",
        },
      ],
      slurpedAt: "2026-08-19T16:05:00.000Z",
      path: ".brain/projects/content-grill/content-grill-brief.svx",
    });
    expect(decoded._tag).toBe("Brain");
    expect(decoded.source).toBe("brain");
  });

  it("decodes an x post receipt", () => {
    const decoded = Schema.decodeUnknownSync(ContextReceiptSchema)({
      _tag: "XPost",
      id: "x:2089816936435827037",
      source: "x_post",
      occurredAt: "2026-08-18T12:00:00.000Z",
      privacy: "public",
      title: "antislop skill on EffectTS",
      summary: "Ran antislop; Effect codebase mostly clean.",
      indexText: "effect antislop skill bookmark",
      refs: [
        {
          label: "tweet",
          href: "https://x.com/example/status/1",
        },
      ],
      slurpedAt: "2026-08-19T16:05:00.000Z",
      tweetId: "2089816936435827037",
      authorHandle: "example",
      metrics: { bookmarkCount: 20, likeCount: 27, replyCount: 3 },
    });
    expect(decoded._tag).toBe("XPost");
    if (decoded._tag === "XPost") {
      expect(decoded.metrics?.bookmarkCount).toBe(20);
    }
  });

  it("round-trips context receipt union", () => {
    const sample = {
      _tag: "XPost" as const,
      id: "x:1",
      source: "x_post" as const,
      occurredAt: "2026-08-19T16:00:00.000Z",
      privacy: "public" as const,
      title: "t",
      summary: "s",
      indexText: "i",
      refs: [],
      slurpedAt: "2026-08-19T16:00:00.000Z",
      tweetId: "1",
    };
    const encoded = Schema.encodeSync(ContextReceiptSchema)(sample);
    const decoded = Schema.decodeUnknownSync(ContextReceiptSchema)(encoded);
    expect(decoded.source).toBe("x_post");
  });

  it("topic batch never generates copy", () => {
    const batch = Schema.decodeUnknownSync(TopicPromptBatchSchema)({
      generatesCopy: false,
      prompts: [
        {
          id: "tp:1",
          title: "x-algorithm weights vs your posting",
          whyNow: "You cloned the repo today; receipts are fresh.",
          receiptIds: ["brain:1", "x:2"],
          digDeeperQuestion:
            "Which of your last three originals matched reply-weight shapes?",
          createdAt: "2026-08-19T16:00:00.000Z",
        },
      ],
    });
    expect(batch.generatesCopy).toBe(false);
  });

  it("slurp cursor tracks source status", () => {
    const cursor = Schema.decodeUnknownSync(SlurpCursorSchema)({
      source: "brain",
      status: "fresh",
      lastSuccessAt: "2026-08-19T16:00:00.000Z",
    });
    expect(cursor.status).toBe("fresh");
  });
});
