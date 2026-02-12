export interface ApplicationErrorProps {
  cause?: string;
  name?: string;
  action?: string;
  message?: string;
  statusCode?: number;
}

export class ApplicationError extends Error {
  statusCode: number;
  action: string;

  constructor({
    message,
    statusCode,
    cause,
    action,
    name,
  }: ApplicationErrorProps) {
    super(message ?? `Application error: ${cause}`, {
      cause: new Error(cause),
    });

    this.name = name ?? this.constructor.name;
    this.statusCode = statusCode ?? 500;
    this.action = action ?? "Please contact support.";
  }

  toJson() {
    return {
      name: this.constructor.name,
      message: this.message,
      status_code: this.statusCode,
      action: this.action,
    };
  }
}
