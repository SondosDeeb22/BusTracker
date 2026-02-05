"use strict";
//==========================================================================================================
//? Import
//==========================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvSecretKey = void 0;
const errors_1 = require("../../errors");
//==========================================================================================================
const getEnvSecretKey = (envKeyName) => {
    const value = process.env[envKeyName];
    const secretKey = typeof value === "string" ? value.trim() : "";
    if (!secretKey) {
        throw new errors_1.InternalError("common.errors.internal");
    }
    return secretKey;
};
exports.getEnvSecretKey = getEnvSecretKey;
//# sourceMappingURL=env.js.map