import { signToken } from "./fns/signToken";
import { AuthTokenResult, CreateTokenProps } from "./types";

type CreateRefreshTokenInput = CreateTokenProps;

type CreateRefreshTokenResponse = AuthTokenResult;

export function createRefreshToken({
  email,
  userId,
}: CreateRefreshTokenInput): CreateRefreshTokenResponse {
  return signToken({
    email,
    userId,
    type: "refresh",
  });
}
