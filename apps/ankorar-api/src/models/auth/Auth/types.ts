export type AuthTokenType = "access" | "refresh";

export interface AuthTokenPayload {
  sub: string;
  email: string;
  type: AuthTokenType;
  iat: number;
  exp: number;
  iss?: string;
  aud?: string;
}

export type CreateTokenProps = {
  email: string;
  userId: string;
};

export type SignTokenProps = CreateTokenProps & { type: AuthTokenType };

export type AuthTokenResult = {
  token: string;
  expiresIn: number;
  type: AuthTokenType;
};
