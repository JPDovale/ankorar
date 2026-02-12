import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class UserNotFound extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 404,
      name: "UserNotFound",
      message: "Usuário não encontrado.",
      action: "Tente novamente com outro e-mail.",
      ...err,
    });
  }
}
