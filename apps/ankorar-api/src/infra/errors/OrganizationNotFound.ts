import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class OrganizationNotFound extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 404,
      name: "OrganizationNotFound",
      message: "Organização não encontrada.",
      action: "Verifique se a organização existe.",
      ...err,
    });
  }
}
