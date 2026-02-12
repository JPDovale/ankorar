import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class InvalidCredentials extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 401,
      name: "InvalidCredentials",
      message: "Credenciais incorretas.",
      action: "Verifique seu email e senha e tente novamente.",
      ...err,
    });
  }
}
