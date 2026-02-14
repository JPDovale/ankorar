import { can } from "./can";
import { createAccessToken } from "./createAccessToken";
import { createRefreshToken } from "./createRefreshToken";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { availableFeatures } from "./fns/availableFeatures";
import { defaultExpiresInSeconds } from "./fns/defaultExpiresInSeconds";
import { defaultRefreshExpiresInSeconds } from "./fns/defaultRefreshExpiresInSeconds";
import { getExpiresInSeconds } from "./fns/getExpiresInSeconds";
import { jwtAlgorithm } from "./fns/jwtAlgorithm";
import { normalizeKey } from "./fns/normalizeKey";
import { signToken } from "./fns/signToken";
import { verifyToken } from "./fns/verifyToken";

const Auth = {
  getAuthenticatedUser,
  can,
  createAccessToken,
  createRefreshToken,
  fns: {
    signToken,
    getExpiresInSeconds,
    normalizeKey,
    verifyToken,
    jwtAlgorithm,
    defaultExpiresInSeconds,
    defaultRefreshExpiresInSeconds,
    availableFeatures,
  },
};

export type {
  AuthTokenPayload,
  AuthTokenResult,
  AuthTokenType,
  CreateTokenProps,
  SignTokenProps,
} from "./types";

export { Auth };
