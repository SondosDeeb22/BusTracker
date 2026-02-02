import { AppError } from './AppError';

export class ConflictError extends AppError {
    statusCode = 409;
    code = 'CONFLICT_ERROR';

    constructor(message: string) {
        super(message);
    }
}
