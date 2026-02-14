import { v7 as uuidv7 } from "uuid";

type CreateIdResponse = string;

export function createId(): CreateIdResponse {
  return uuidv7();
}
