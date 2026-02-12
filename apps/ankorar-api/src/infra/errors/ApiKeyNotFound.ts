import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class ApiKeyNotFound extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 404,
      name: "ApiKeyNotFound",
      message: "Chave de api não encontrado.",
      action: "Verifique se a chave de api fornecida realmente existe.",
      ...err,
    });
  }
}
