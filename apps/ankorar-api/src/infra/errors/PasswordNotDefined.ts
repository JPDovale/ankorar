import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class PasswordNotDefined extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 409,
      name: "PasswordNotDefined",
      message: "Usuário ainda não definiu a senha.",
      action:
        "Tente pedir um link para reset de senha na aba 'Esqueci minha senha'.",
      ...err,
    });
  }
}
