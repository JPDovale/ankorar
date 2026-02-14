import { dayjsUtc } from "./fns/dayjsUtc";

const isoUtcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

type IsValidUtcIsoInput = [value: string];

type IsValidUtcIsoResponse = boolean;

export function isValidUtcIso(
  ...[value]: IsValidUtcIsoInput
): IsValidUtcIsoResponse {
  return isoUtcRegex.test(value) && dayjsUtc.utc(value).isValid();
}
