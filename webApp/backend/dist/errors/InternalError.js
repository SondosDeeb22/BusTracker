"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = void 0;
class InternalError extends Error {
    statusCode = 500;
    messageKey = 'common.errors.internal';
    constructor(cause) {
        super('Internal server error');
        this.name = 'InternalError';
        if (cause) {
            this.cause = cause;
        }
    }
}
exports.InternalError = InternalError;
//# sourceMappingURL=InternalError.js.map