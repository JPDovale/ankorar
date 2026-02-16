import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class ApiKeyNotRevokedCannotBeDeleted extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 400,
      name: "ApiKeyNotRevokedCannotBeDeleted",
      message: "Só é possível excluir uma chave de API após revogá-la.",
      action: "Revogue a chave antes de excluí-la.",
      ...err,
    });
  }
}
