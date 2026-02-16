import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class MemberCannotBeRemoved extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 400,
      name: "MemberCannotBeRemoved",
      message: "Não é possível remover o criador da organização.",
      action: "Transfira a propriedade antes de remover o membro.",
      ...err,
    });
  }
}
