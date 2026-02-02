"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailServiceError = void 0;
class EmailServiceError extends Error {
    statusCode = 502; // Bad Gateway
    messageKey = 'common.errors.emailFailed';
    constructor(message = 'Failed to send email', cause) {
        super(message);
        this.name = 'EmailServiceError';
        if (cause)
            this.cause = cause;
    }
}
exports.EmailServiceError = EmailServiceError;
//# sourceMappingURL=EmailServiceError.js.map