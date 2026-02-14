import { InvalidApiKey } from "@/src/infra/errors/InvalidApiKey";

type ComputeTextInput = {
  text: string;
};

type ComputeTextResponse = {
  env: "live" | "test";
  prefix: string;
  secret: string;
  scope: string;
};

export function computeText({ text }: ComputeTextInput): ComputeTextResponse {
  const [ak, scope, env, prefix, ...secretParts] = text.split("_");
  const secret = secretParts.join("_");

  if (!scope || !env || !prefix || !secret) {
    throw new InvalidApiKey();
  }

  if (ak !== "ak" || scope !== "org" || (env !== "live" && env !== "test")) {
    throw new InvalidApiKey();
  }

  return {
    env,
    prefix,
    scope,
    secret,
  };
}
