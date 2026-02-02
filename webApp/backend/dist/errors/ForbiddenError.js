"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const AppError_1 = require("./AppError");
class ForbiddenError extends AppError_1.AppError {
    statusCode = 403;
    code = 'FORBIDDEN_ERROR';
    constructor(message) {
        super(message);
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=ForbiddenError.js.map