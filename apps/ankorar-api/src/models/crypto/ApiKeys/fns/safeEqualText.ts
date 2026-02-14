import { InvalidApiKey } from "@/src/infra/errors/InvalidApiKey";
import { timingSafeEqual } from "node:crypto";

type SafeEqualTextInput = {
  a: string;
  b: string;
};

type SafeEqualTextResponse = void;

export function safeEqualText({ a, b }: SafeEqualTextInput): SafeEqualTextResponse {
  const ab = Buffer.from(a, "utf-8");
  const bb = Buffer.from(b, "utf-8");

  if (ab.length !== bb.length) {
    throw new InvalidApiKey();
  }

  const isValid = timingSafeEqual(ab, bb);

  if (!isValid) {
    throw new InvalidApiKey();
  }
}
