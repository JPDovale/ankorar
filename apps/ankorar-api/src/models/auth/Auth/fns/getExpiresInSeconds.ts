import { AuthTokenType } from "../types";
import { defaultExpiresInSeconds } from "./defaultExpiresInSeconds";
import { defaultRefreshExpiresInSeconds } from "./defaultRefreshExpiresInSeconds";

type GetExpiresInSecondsInput = {
  type: AuthTokenType;
};

type GetExpiresInSecondsResponse = {
  expiresInSeconds: number;
};

export function getExpiresInSeconds({
  type,
}: GetExpiresInSecondsInput): GetExpiresInSecondsResponse {
  const expiresInSeconds =
    type === "access"
      ? process.env.JWT_EXPIRES_IN_SECONDS
      : process.env.JWT_REFRESH_EXPIRES_IN_SECONDS;

  const defaultValue =
    type === "access"
      ? defaultExpiresInSeconds
      : defaultRefreshExpiresInSeconds;

  if (!expiresInSeconds) {
    return { expiresInSeconds: defaultValue };
  }

  const parsed = Number.parseInt(expiresInSeconds, 10);
  return Number.isFinite(parsed) && parsed > 0
    ? { expiresInSeconds: parsed }
    : { expiresInSeconds: defaultValue };
}
