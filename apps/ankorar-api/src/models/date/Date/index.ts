import { addMinutes } from "./addMinutes";
import { addSeconds } from "./addSeconds";
import { isAfterNowUnix } from "./isAfterNowUnix";
import { isValidUnixSeconds } from "./isValidUnixSeconds";
import { isValidUtcIso } from "./isValidUtcIso";
import { nowUnixSeconds } from "./nowUnixSeconds";
import { nowUtcDate } from "./nowUtcDate";
import { nowUtcIso } from "./nowUtcIso";

const Date = {
  nowUtcDate,
  nowUtcIso,
  nowUnixSeconds,
  isValidUtcIso,
  isValidUnixSeconds,
  isAfterNowUnix,
  addMinutes,
  addSeconds,
};

export { Date };
