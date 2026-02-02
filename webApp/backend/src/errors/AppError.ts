export abstract class AppError extends Error {
    abstract statusCode: number;
    abstract code: string;

    protected constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}