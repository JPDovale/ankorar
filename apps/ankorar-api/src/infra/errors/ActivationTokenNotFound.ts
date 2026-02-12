import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class ActivationTokenNotFound extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 404,
      name: "ActivationTokenNotFound",
      message: "Token de ativação não encontrado.",
      action: "Tente gerar um novo token de ativação.",
      ...err,
    });
  }
}
