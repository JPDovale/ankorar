type GetFrontendOriginInput = void;

type GetFrontendOriginResponse = string;

/**
 * Origem (base URL) do frontend para links em e-mails (ex.: ativação de conta).
 * Use FRONTEND_ORIGIN ou APP_URL em produção.
 */
export function getFrontendOrigin(
  _props?: GetFrontendOriginInput,
): GetFrontendOriginResponse {
  const envOrigin =
    process.env.FRONTEND_ORIGIN ?? process.env.APP_URL ?? "";

  if (envOrigin) {
    return envOrigin.replace(/\/$/, "");
  }

  if (["development", "test"].includes(process.env.NODE_ENV ?? "")) {
    return "http://localhost:5173";
  }

  return "https://ankorar.com";
}
