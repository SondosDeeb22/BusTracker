import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
    statusCode = 401;
    code = 'UNAUTHORIZED_ERROR';

    constructor(message: string) {
        super(message);
    }
}
