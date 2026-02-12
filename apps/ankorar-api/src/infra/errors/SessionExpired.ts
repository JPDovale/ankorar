import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class SessionExpired extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 403,
      name: "SessionExpired",
      message: "Sessão expirada",
      action: "Faça login novamente para continuar navegando",
      ...err,
    });
  }
}
