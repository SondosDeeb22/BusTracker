import { AppError } from './AppError';
// Bad Request Error
export class ValidationError extends AppError {
    statusCode = 400;
    code = 'VALIDATION_ERROR';

    constructor(message: string) {
        super(message);
    }
}