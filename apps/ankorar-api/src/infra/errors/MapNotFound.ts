import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class MapNotFound extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 404,
      name: "MapNotFound",
      message: "Mapa não encontrado.",
      action: "Tente novamente com outro mapa.",
      ...err,
    });
  }
}
