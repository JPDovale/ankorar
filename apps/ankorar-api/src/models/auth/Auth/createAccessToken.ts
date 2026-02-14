import { signToken } from "./fns/signToken";
import { AuthTokenResult, CreateTokenProps } from "./types";

type CreateAccessTokenInput = CreateTokenProps;

type CreateAccessTokenResponse = AuthTokenResult;

export function createAccessToken({
  email,
  userId,
}: CreateAccessTokenInput): CreateAccessTokenResponse {
  return signToken({
    email,
    userId,
    type: "access",
  });
}
