export class EmailServiceError extends Error {
  public readonly statusCode = 502; // Bad Gateway
  public readonly messageKey = 'common.errors.emailFailed';

  constructor(message = 'Failed to send email', cause?: unknown) {
    super(message);
    this.name = 'EmailServiceError';
    if (cause) (this as any).cause = cause;
  }
}