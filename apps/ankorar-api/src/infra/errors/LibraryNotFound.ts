import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class LibraryNotFound extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 404,
      name: "LibraryNotFound",
      message: "Biblioteca não encontrada.",
      action: "Tente novamente com outra biblioteca.",
      ...err,
    });
  }
}
