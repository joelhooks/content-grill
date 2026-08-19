import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    ".agent_sources/**",
    "node_modules/**",
    "tools/oxlint/anti-slop/**",
  ],
});
