import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class MemberAlreadyInOrganization extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 400,
      name: "MemberAlreadyInOrganization",
      message: "Membro já faz parte desta organização.",
      action: "Verifique se o membro já faz parte da organização.",
      ...err,
    });
  }
}
