import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class MemberNotFound extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 404,
      name: "MemberNotFound",
      message: "Membro não encontrado.",
      action: "Verifique se voce e um membro da organização.",
      ...err,
    });
  }
}
