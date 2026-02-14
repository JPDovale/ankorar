import { createHmac } from "node:crypto";

type HashSecretInput = {
  secret: string;
};

type HashSecretResponse = string;

export function hashSecret({ secret }: HashSecretInput): HashSecretResponse {
  return createHmac("sha256", process.env.API_KEY_PEPPER!)
    .update(secret, "utf-8")
    .digest("base64");
}
