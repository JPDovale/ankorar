import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class UserAlreadyExists extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 409,
      name: "UserAlreadyExists",
      message: "Usuário já existe.",
      action: "Tente novamente com outro e-mail.",
      ...err,
    });
  }
}
