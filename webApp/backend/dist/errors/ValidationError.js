"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const AppError_1 = require("./AppError");
// Bad Request Error
class ValidationError extends AppError_1.AppError {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    constructor(message) {
        super(message);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidationError.js.map