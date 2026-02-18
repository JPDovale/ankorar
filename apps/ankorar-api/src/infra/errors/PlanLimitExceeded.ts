import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class PlanLimitExceeded extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 403,
      name: "PlanLimitExceeded",
      message:
        err.message ?? "Limite do seu plano foi atingido para esta ação.",
      action:
        err.action ??
        "Faça upgrade do seu plano para continuar ou remova itens existentes.",
      ...err,
    });
  }
}
