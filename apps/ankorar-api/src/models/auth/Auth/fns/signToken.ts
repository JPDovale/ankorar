import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { getExpiresInSeconds } from "./getExpiresInSeconds";
import { jwtAlgorithm } from "./jwtAlgorithm";
import { normalizeKey } from "./normalizeKey";
import { AuthTokenResult, SignTokenProps } from "../types";

type SignTokenInput = SignTokenProps;

type SignTokenResponse = AuthTokenResult;

export function signToken({
  email,
  type,
  userId,
}: SignTokenInput): SignTokenResponse {
  const { key: privateKey } = normalizeKey({
    key: process.env.JWT_PRIVATE_KEY,
  });

  const { expiresInSeconds: expiresIn } = getExpiresInSeconds({
    type,
  });

  const options: SignOptions = {
    algorithm: jwtAlgorithm,
    expiresIn,
    subject: userId,
  };

  if (process.env.JWT_ISSUER) {
    options.issuer = process.env.JWT_ISSUER;
  }

  if (process.env.JWT_AUDIENCE) {
    options.audience = process.env.JWT_AUDIENCE;
  }

  const token = jwt.sign({ email, type }, privateKey, options);

  return {
    token,
    expiresIn,
    type,
  };
}
