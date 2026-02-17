import { ApplicationError } from "./ApplicationError";

export class MindMapNormalizationError extends ApplicationError {
  constructor(cause: string, details?: unknown) {
    super({
      name: "MindMapNormalizationError",
      statusCode: 422,
      message: "Resposta da IA em formato inválido.",
      action: "Tente outra descrição.",
      cause,
      details,
    });
  }
}
