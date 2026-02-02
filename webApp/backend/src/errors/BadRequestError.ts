import { AppError } from './AppError';

export class BadRequestError extends AppError {
    statusCode = 400;
    code = 'BAD_REQUEST_ERROR';

    constructor(message: string) {
        super(message);
    }
}