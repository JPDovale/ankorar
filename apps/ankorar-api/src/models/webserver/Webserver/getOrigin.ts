type GetOriginInput = void;

type GetOriginResponse = string;

export function getOrigin(_props?: GetOriginInput): GetOriginResponse {
  const origin = "https://ankorar.com";

  if (["development", "test"].includes(process.env.NODE_ENV ?? "")) {
    return `http://localhost:${process.env.PORT ?? 9090}`;
  }

  return origin;
}
