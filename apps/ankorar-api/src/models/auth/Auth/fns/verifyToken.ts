import { SessionExpired } from "@/src/infra/errors/SessionExpired";
import { dateModule } from "../../../date/DateModule";
import { AuthTokenPayload, AuthTokenType } from "../types";
import { jwtAlgorithm } from "./jwtAlgorithm";
import { normalizeKey } from "./normalizeKey";
import { JwtPayload, VerifyOptions, verify } from "jsonwebtoken";

type VerifyTokenInput = {
  token: string;
  type: AuthTokenType;
};

type VerifyTokenResponse = AuthTokenPayload;

export function verifyToken({
  token,
  type,
}: VerifyTokenInput): VerifyTokenResponse {
  const { key: publicKey } = normalizeKey({
    key: process.env.JWT_PUBLIC_KEY,
  });

  const options: VerifyOptions = { algorithms: [jwtAlgorithm] };

  if (process.env.JWT_ISSUER) {
    options.issuer = process.env.JWT_ISSUER;
  }

  if (process.env.JWT_AUDIENCE) {
    options.audience = process.env.JWT_AUDIENCE;
  }

  try {
    const decoded = verify(token, publicKey, options);
    if (typeof decoded === "string") {
      throw new SessionExpired();
    }

    const payload = decoded as JwtPayload & {
      email?: string;
      type?: string;
    };

    if (!payload.sub || typeof payload.sub !== "string") {
      throw new SessionExpired();
    }

    if (!payload.email || typeof payload.email !== "string") {
      throw new SessionExpired();
    }

    if (payload.type !== type) {
      throw new SessionExpired();
    }

    if (typeof payload.iat !== "number" || typeof payload.exp !== "number") {
      throw new SessionExpired();
    }

    if (
      !dateModule.Date.isValidUnixSeconds(payload.iat) ||
      !dateModule.Date.isValidUnixSeconds(payload.exp)
    ) {
      throw new SessionExpired();
    }

    if (dateModule.Date.isAfterNowUnix(payload.iat)) {
      throw new SessionExpired();
    }

    if (!dateModule.Date.isAfterNowUnix(payload.exp)) {
      throw new SessionExpired();
    }

    return {
      sub: payload.sub,
      email: payload.email,
      type,
      iat: payload.iat,
      exp: payload.exp,
      iss: typeof payload.iss === "string" ? payload.iss : undefined,
      aud: typeof payload.aud === "string" ? payload.aud : undefined,
    };
  } catch {
    throw new SessionExpired();
  }
}
