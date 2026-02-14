import { dayjsUtc } from "./fns/dayjsUtc";

type IsValidUnixSecondsInput = [value: number];

type IsValidUnixSecondsResponse = boolean;

export function isValidUnixSeconds(
  ...[value]: IsValidUnixSecondsInput
): IsValidUnixSecondsResponse {
  return Number.isFinite(value) && dayjsUtc.unix(value).utc().isValid();
}
