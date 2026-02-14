import { dayjsUtc } from "./fns/dayjsUtc";

type NowUnixSecondsInput = void;

type NowUnixSecondsResponse = number;

export function nowUnixSeconds(
  input?: NowUnixSecondsInput,
): NowUnixSecondsResponse {
  void input;
  return dayjsUtc.utc().unix();
}
