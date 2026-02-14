import { dayjsUtc } from "./fns/dayjsUtc";

type AddMinutesInput = [date: Date, minutes: number];

type AddMinutesResponse = Date;

export function addMinutes(...[date, minutes]: AddMinutesInput): AddMinutesResponse {
  return dayjsUtc(date).utc().add(minutes, "minute").toDate();
}
