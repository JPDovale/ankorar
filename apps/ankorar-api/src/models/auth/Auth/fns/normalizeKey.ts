import { InternalServerError } from "@/src/infra/errors/InternalServerError";

type NormalizeKeyInput = {
  key?: string;
};

type NormalizeKeyResponse = {
  key: string;
};

export function normalizeKey({
  key,
}: NormalizeKeyInput): NormalizeKeyResponse {
  if (!key) {
    throw new InternalServerError({
      cause: "JWT_KEY_IS_NOT_DEFINED is not configured",
    });
  }

  const decoded = Buffer.from(key, "base64").toString("utf-8");
  return {
    key: decoded.replace(/\\n/g, "\n"),
  };
}
