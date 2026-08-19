import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";

/**
 * Ultracite core + anti-slop evidence rules + Effect service constructor rule.
 * Repo-local oxlint 1.78 drifts above fleet STACK.md 1.74 — required by @oxlint/plugins.
 */
export default defineConfig({
  extends: [core],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    ".agent_sources/**",
    "node_modules/**",
    "tools/oxlint/anti-slop/**",
  ],
  options: {
    typeAware: true,
  },
  jsPlugins: [
    { name: "anti-slop", specifier: "./tools/oxlint/anti-slop/index.ts" },
    {
      name: "anti-slop-effect",
      specifier: "./tools/oxlint/anti-slop/effect/index.ts",
    },
  ],
  rules: {
    // Match jc-slack: keep Ultracite useful, kill alphabetical/stylistic whack-a-mole.
    "consistent-type-specifier-style": "off",
    "default-case": "off",
    "func-names": "off",
    "max-classes-per-file": "off",
    "no-array-sort": "off",
    "numeric-separators-style": "off",
    "prefer-destructuring": "off",
    "require-unicode-regexp": "off",
    "sort-keys": "off",
    "switch-case-braces": "off",
    // Conflicts with anti-slop (unknown is an evidence discard; SAFETY covers XState phantoms).
    "typescript/use-unknown-in-catch-callback-variable": "off",
    "typescript/no-unsafe-type-assertion": "off",
    // Effect Schema.TaggedError(...) looks like a throw to unicorn.
    "unicorn/throw-new-error": "off",

    "anti-slop/no-chained-type-assertions": "error",
    "anti-slop/no-conditional-empty-object-spread": "error",
    "anti-slop/no-known-value-widening": "error",
    "anti-slop/no-module-mocking": "error",
    "anti-slop/no-object-parameters": "error",
    "anti-slop/no-reflect-apply": "error",
    "anti-slop/no-reflect-get": "error",
    "anti-slop/no-runtime-typeof": "error",
    "anti-slop/no-shape-in-symbol-names": "error",
    "anti-slop/no-unknown-parameters": "error",
    "anti-slop/no-unknown-returns": "error",
    "anti-slop/no-unknown-type-aliases": "error",
    "anti-slop/no-unsafe-dictionary-type": "error",
    "anti-slop/no-widen-then-assert": "error",
    "anti-slop/require-safety-comment-for-type-assertion": "error",
    "anti-slop-effect/no-service-constructor-imports": "error",
  },
});
