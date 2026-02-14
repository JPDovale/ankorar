import { randomBytes } from "node:crypto";

type GenerateSecretResponse = string;

export function generateSecret(): GenerateSecretResponse {
  return randomBytes(32).toString("base64");
}
