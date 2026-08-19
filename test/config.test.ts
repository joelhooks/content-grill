import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { Effect, Schema } from "effect";
import { describe, expect, it } from "vitest";

import { loadConfig, toConfigDoctorView } from "../src/config/load.js";
import { ContentGrillConfigFileSchema } from "../src/domain/config.js";

describe("config", () => {
  it("decodes a partial config file", () => {
    const decoded = Schema.decodeUnknownSync(ContentGrillConfigFileSchema)({
      version: 1,
      slurpHost: "scheduler-host",
      sources: {
        x_post: { handle: "demo", oauthEnvPrefix: "x_demo" },
      },
    });
    expect(decoded.slurpHost).toBe("scheduler-host");
    expect(decoded.sources?.x_post?.handle).toBe("demo");
  });

  it("resolves defaults when no file and no env", async () => {
    const missing = path.join(
      tmpdir(),
      `content-grill-missing-${Date.now()}.json`
    );
    const config = await Effect.runPromise(loadConfig(missing));
    expect(config.version).toBe(1);
    expect(config.slurpHost).toBe("localhost");
    expect(config.slurpIntervalSeconds).toBe(300);
    expect(config.sources.brain.enabled).toBe(true);
    expect(config.v1Sources).toEqual(["brain", "x_post"]);
  });

  it("file values beat defaults; env beats file", async () => {
    const dir = path.join(tmpdir(), `content-grill-cfg-${Date.now()}`);
    mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, "config.json");
    writeFileSync(
      filePath,
      JSON.stringify({
        version: 1,
        dataDir: path.join(dir, "data-from-file"),
        slurpHost: "from-file",
        slurpIntervalSeconds: 120,
        sources: { x_post: { handle: "filehandle" } },
      })
    );

    const prevHost = process.env["CONTENT_GRILL_SLURP_HOST"];
    const prevData = process.env["CONTENT_GRILL_DATA_DIR"];
    process.env["CONTENT_GRILL_SLURP_HOST"] = "from-env";
    delete process.env["CONTENT_GRILL_DATA_DIR"];

    try {
      const config = await Effect.runPromise(loadConfig(filePath));
      expect(config.slurpHost).toBe("from-env");
      expect(config.dataDir).toBe(path.join(dir, "data-from-file"));
      expect(config.slurpIntervalSeconds).toBe(120);
      expect(config.sources.x_post.handle).toBe("filehandle");
      const view = toConfigDoctorView(config, true);
      expect(view.sources.xHandleSet).toBe(true);
      expect(view.configFilePresent).toBe(true);
    } finally {
      if (prevHost === undefined) {
        delete process.env["CONTENT_GRILL_SLURP_HOST"];
      } else {
        process.env["CONTENT_GRILL_SLURP_HOST"] = prevHost;
      }
      if (prevData === undefined) {
        delete process.env["CONTENT_GRILL_DATA_DIR"];
      } else {
        process.env["CONTENT_GRILL_DATA_DIR"] = prevData;
      }
    }
  });
});
