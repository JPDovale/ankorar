import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class OrganizationInviteNotFound extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 404,
      name: "OrganizationInviteNotFound",
      message: "Convite não encontrado.",
      action: "Tente novamente com outro convite.",
      ...err,
    });
  }
}
