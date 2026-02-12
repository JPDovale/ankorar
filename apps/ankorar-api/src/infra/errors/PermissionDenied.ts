import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class PermissionDenied extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 403,
      name: "PermissionDenied",
      message: "Usuário não tem permissão para executar essa função.",
      action:
        "Verifique se você tem as permissões necessárias para executar essa função",
      ...err,
    });
  }
}
