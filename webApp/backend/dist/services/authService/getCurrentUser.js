"use strict";
//==========================================================================================================
//? Import
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const authHelpher_1 = __importDefault(require("../../helpers/authHelpher"));
const authHelper = new authHelpher_1.default();
const errors_1 = require("../../errors");
//==========================================================================================================
const getCurrentUser = async (req, res) => {
    try {
        const userData = authHelper.getUserData(req);
        return { status: 200, messageKey: "auth.currentUser.success", data: userData };
        // ----------------------------------------
    }
    catch (error) {
        console.error("Error retrieving user data.", error);
        if (error instanceof errors_1.UnauthorizedError) {
            return { status: 401, messageKey: error.message };
        }
        return { status: 500, messageKey: "common.errors.internal" };
    }
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=getCurrentUser.js.map