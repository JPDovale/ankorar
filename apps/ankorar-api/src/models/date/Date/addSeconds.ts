import { dayjsUtc } from "./fns/dayjsUtc";

type AddSecondsInput = [date: Date, seconds: number];

type AddSecondsResponse = Date;

export function addSeconds(...[date, seconds]: AddSecondsInput): AddSecondsResponse {
  return dayjsUtc(date).utc().add(seconds, "seconds").toDate();
}
