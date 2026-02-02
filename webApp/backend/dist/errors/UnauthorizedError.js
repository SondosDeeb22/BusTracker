"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const AppError_1 = require("./AppError");
class UnauthorizedError extends AppError_1.AppError {
    statusCode = 401;
    code = 'UNAUTHORIZED_ERROR';
    constructor(message) {
        super(message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=UnauthorizedError.js.map