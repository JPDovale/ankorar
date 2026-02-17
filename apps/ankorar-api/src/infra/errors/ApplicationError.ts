export interface ApplicationErrorProps {
  cause?: string;
  name?: string;
  action?: string;
  message?: string;
  statusCode?: number;
  /** Extra data for server logs only (not sent to client in toJson). */
  details?: unknown;
}

export class ApplicationError extends Error {
  statusCode: number;
  action: string;
  details?: unknown;

  constructor({
    message,
    statusCode,
    cause,
    action,
    name,
    details,
  }: ApplicationErrorProps) {
    super(message ?? `Application error: ${cause}`, {
      cause: cause != null ? new Error(cause) : undefined,
    });

    this.name = name ?? this.constructor.name;
    this.statusCode = statusCode ?? 500;
    this.action = action ?? "Please contact support.";
    this.details = details;
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
