import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const isoUtcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

export const date = {
  nowUtcDate: () => dayjs.utc().toDate(),
  nowUtcIso: () => dayjs.utc().toISOString(),
  nowUnixSeconds: () => dayjs.utc().unix(),
  isValidUtcIso: (value: string) =>
    isoUtcRegex.test(value) && dayjs.utc(value).isValid(),
  isValidUnixSeconds: (value: number) =>
    Number.isFinite(value) && dayjs.unix(value).utc().isValid(),
  isAfterNowUnix: (value: number) => value > dayjs.utc().unix(),
  addMinutes: (date: Date, minutes: number) =>
    dayjs(date).utc().add(minutes, "minute").toDate(),
  addSeconds: (date: Date, seconds: number) =>
    dayjs(date).utc().add(seconds, "seconds").toDate(),
};
