import { ApplicationError, ApplicationErrorProps } from "./ApplicationError";

export class InternalServerError extends ApplicationError {
  constructor(err: ApplicationErrorProps = {}) {
    const error = {
      statusCode: 500,
      name: "InternalServerError",
      message: "An internal server error occurred.",
      ...err,
    };

    if (
      process.env.NODE_ENV !== "production" &&
      process.env.NODE_ENV !== "staging"
    ) {
      console.error(error);
    }

    super(error);
  }
}
