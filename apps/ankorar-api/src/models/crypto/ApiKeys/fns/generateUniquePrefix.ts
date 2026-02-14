import { v7 as uuidv7 } from "uuid";

type GenerateUniquePrefixResponse = string;

export function generateUniquePrefix(): GenerateUniquePrefixResponse {
  return uuidv7().split("-").slice(0, 2).join("");
}
