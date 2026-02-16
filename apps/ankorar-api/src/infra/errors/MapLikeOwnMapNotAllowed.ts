import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class MapLikeOwnMapNotAllowed extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 403,
      name: "MapLikeOwnMapNotAllowed",
      message: "Não é possível marcar como gostei um mapa que é seu.",
      action: "Marque como gostei apenas mapas de outros usuários.",
      ...err,
    });
  }
}
