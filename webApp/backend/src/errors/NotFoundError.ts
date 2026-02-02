import { AppError } from './AppError';

export class NotFoundError extends AppError {
    statusCode = 404;
    code = 'NOT_FOUND_ERROR';

    constructor(message: string) {
        super(message);
    }
}
