"use strict";
//==========================================================================================================
//? Import
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractJWTData = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../../errors");
//==========================================================================================================
const extractJWTData = (req, tokenName, secretKey) => {
    try {
        const token = req.cookies?.[tokenName];
        if (!token) {
            throw new errors_1.UnauthorizedError("common.auth.sessionExpired");
        }
        const user_data = jsonwebtoken_1.default.verify(token, secretKey);
        if (!user_data || typeof user_data !== "object") {
            throw new errors_1.UnauthorizedError("common.auth.invalidToken");
        }
        return user_data;
    }
    catch (error) {
        if (error instanceof errors_1.UnauthorizedError) {
            throw error;
        }
        throw new errors_1.UnauthorizedError("common.errors.unauthorized");
    }
};
exports.extractJWTData = extractJWTData;
//# sourceMappingURL=jwt.js.map