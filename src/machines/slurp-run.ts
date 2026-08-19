import { setup } from "xstate";

import type { SourceKind } from "../domain/primitives.js";
import type { SlurpRunStatus } from "../domain/slurp.js";

/** XState context for one source's slurp lifecycle — aligns with SlurpCursor.status. */
export interface SlurpMachineContext {
  readonly source: SourceKind;
  readonly cursor: string | undefined;
  readonly lastSuccessAt: string | undefined;
  readonly lastError: string | undefined;
  readonly receiptsUpserted: number;
}

export type SlurpMachineEvent =
  | { readonly type: "TICK" }
  | {
      readonly type: "SUCCESS";
      readonly cursor: string;
      readonly upserted: number;
    }
  | { readonly type: "FAIL"; readonly error: string }
  | { readonly type: "DISABLE" }
  | { readonly type: "ENABLE" };

/** Map XState state id to domain SlurpRunStatus — closed set, no string dictionary. */
export const machineStatus = (stateValue: string): SlurpRunStatus => {
  switch (stateValue) {
    case "idle":
    case "syncing":
    case "fresh":
    case "failed":
    case "disabled":
      return stateValue;
    default:
      return "idle";
  }
};

export const createSlurpMachine = (source: SourceKind) =>
  setup({
    types: {
      // SAFETY: XState setup() needs a phantom context value for inference only; runtime context is set in createMachine.
      context: {} as SlurpMachineContext,
      // SAFETY: XState setup() needs a phantom event value for inference only; events are produced at runtime.
      events: {} as SlurpMachineEvent,
    },
  }).createMachine({
    id: `slurp-${source}`,
    initial: "idle",
    context: {
      source,
      cursor: undefined,
      lastSuccessAt: undefined,
      lastError: undefined,
      receiptsUpserted: 0,
    },
    states: {
      idle: {
        on: { TICK: "syncing", DISABLE: "disabled" },
      },
      syncing: {
        on: {
          SUCCESS: {
            target: "fresh",
            actions: ({ context, event }) =>
              event.type === "SUCCESS"
                ? {
                    ...context,
                    cursor: event.cursor,
                    lastSuccessAt: new Date().toISOString(),
                    lastError: undefined,
                    receiptsUpserted: event.upserted,
                  }
                : context,
          },
          FAIL: {
            target: "failed",
            actions: ({ context, event }) =>
              event.type === "FAIL"
                ? { ...context, lastError: event.error }
                : context,
          },
        },
      },
      fresh: {
        on: { TICK: "syncing", DISABLE: "disabled" },
      },
      failed: {
        on: { TICK: "syncing", ENABLE: "idle", DISABLE: "disabled" },
      },
      disabled: {
        on: { ENABLE: "idle" },
      },
    },
  });
