import { dayjsUtc } from "./fns/dayjsUtc";

type NowUtcDateInput = void;

type NowUtcDateResponse = Date;

export function nowUtcDate(input?: NowUtcDateInput): NowUtcDateResponse {
  void input;
  return dayjsUtc.utc().toDate();
}
