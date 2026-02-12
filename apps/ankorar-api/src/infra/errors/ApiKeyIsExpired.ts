import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class ApiKeyIsExpired extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 403,
      name: "ApiKeyIsExpired",
      message: "Chave de api expirada.",
      action:
        "Verifique se a chave de api fornecida esta ativa e n'ao foi revogada.",
      ...err,
    });
  }
}
