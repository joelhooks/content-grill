import { Schema } from "effect";

export const NextActionSchema = Schema.Struct({
  command: Schema.String,
  description: Schema.String,
});
export type NextAction = typeof NextActionSchema.Type;

export const CliErrorSchema = Schema.Struct({
  code: Schema.String,
  message: Schema.String,
});
export type CliError = typeof CliErrorSchema.Type;

export const SuccessEnvelopeSchema = Schema.Struct({
  ok: Schema.Literal(true),
  command: Schema.String,
  result: Schema.Unknown,
  next_actions: Schema.Array(NextActionSchema),
});

export const FailureEnvelopeSchema = Schema.Struct({
  ok: Schema.Literal(false),
  command: Schema.String,
  result: Schema.Null,
  error: CliErrorSchema,
  fix: Schema.String,
  next_actions: Schema.Array(NextActionSchema),
});

export const DoctorResultSchema = Schema.Struct({
  version: Schema.String,
  storeReady: Schema.Boolean,
  config: Schema.optionalKey(Schema.Unknown),
  slurpers: Schema.Array(
    Schema.Struct({
      source: Schema.String,
      status: Schema.String,
      lastSuccessAt: Schema.optionalKey(Schema.String),
      searchLatencyMsP50: Schema.optionalKey(Schema.Number),
    })
  ),
});
export type DoctorResult = typeof DoctorResultSchema.Type;

export const SlurpStatusResultSchema = Schema.Struct({
  cursors: Schema.Array(Schema.Unknown),
});
export type SlurpStatusResult = typeof SlurpStatusResultSchema.Type;
