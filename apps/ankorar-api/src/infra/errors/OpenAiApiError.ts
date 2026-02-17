import { ApplicationError } from "./ApplicationError";

export type OpenAiApiErrorDetails = {
  message: string;
  status?: number;
  code?: string;
  responseData?: unknown;
};

export class OpenAiApiError extends ApplicationError {
  constructor(cause: string, details?: OpenAiApiErrorDetails) {
    super({
      name: "OpenAiApiError",
      statusCode: 502,
      message: "Falha ao gerar conteúdo com IA.",
      action: "Tente novamente ou verifique a configuração da API.",
      cause,
      details,
    });
  }
}
