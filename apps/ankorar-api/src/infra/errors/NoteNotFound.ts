import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class NoteNotFound extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 404,
      name: "NoteNotFound",
      message: "Nota não encontrada.",
      action: "Tente novamente com outra nota.",
      ...err,
    });
  }
}
