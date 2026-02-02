import { AppError } from './AppError';

export class ForbiddenError extends AppError {
    statusCode = 403;
    code = 'FORBIDDEN_ERROR';

    constructor(message: string) {
        super(message);
    }
}
