"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
const AppError_1 = require("./AppError");
class ConflictError extends AppError_1.AppError {
    statusCode = 409;
    code = 'CONFLICT_ERROR';
    constructor(message) {
        super(message);
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=ConflictError.js.map