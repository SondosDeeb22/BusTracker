export class InternalError extends Error {
  public readonly statusCode = 500;
  public readonly messageKey = 'common.errors.internal';

  constructor(cause?: unknown) {
    super('Internal server error');
    this.name = 'InternalError';

    if (cause) {
      (this as any).cause = cause;
    }
  }
}
