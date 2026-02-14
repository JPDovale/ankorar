import { dayjsUtc } from "./fns/dayjsUtc";

type NowUtcIsoInput = void;

type NowUtcIsoResponse = string;

export function nowUtcIso(input?: NowUtcIsoInput): NowUtcIsoResponse {
  void input;
  return dayjsUtc.utc().toISOString();
}
