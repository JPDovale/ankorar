import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class InvalidApiKey extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 403,
      name: "InvalidApiKey",
      message: "Chave de api invalida.",
      action: "Verifique se a chave de api fornecida esta correta.",
      ...err,
    });
  }
}
