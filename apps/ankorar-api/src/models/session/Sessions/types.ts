export type AuthTokenResult = {
  token: string;
  expiresIn: number;
  type: "access" | "refresh";
};
