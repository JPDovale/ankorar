import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class ValidationError extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    super({
      statusCode: 400,
      name: "ValidationError",
      message: "Validation error occurred.",
      ...err,
    });
  }
}
