import { dayjsUtc } from "./fns/dayjsUtc";

type IsAfterNowUnixInput = [value: number];

type IsAfterNowUnixResponse = boolean;

export function isAfterNowUnix(
  ...[value]: IsAfterNowUnixInput
): IsAfterNowUnixResponse {
  return value > dayjsUtc.utc().unix();
}
