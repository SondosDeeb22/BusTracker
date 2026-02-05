"use strict";
//==========================================================================================================
//? Import
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const authHelpher_1 = __importDefault(require("../../helpers/authHelpher"));
const authHelper = new authHelpher_1.default();
const errors_1 = require("../../errors");
//==========================================================================================================
const logout = async (req, res) => {
    try {
        authHelper.getUserData(req);
        authHelper.clearLoginSession(res);
        return { status: 200, messageKey: "auth.logout.success" };
        // -----------------------------------------------------------
    }
    catch (error) {
        console.error("Error during logout.", error);
        if (error instanceof errors_1.UnauthorizedError) {
            return { status: 401, messageKey: error.message };
        }
        return { status: 500, messageKey: "common.errors.internal" };
    }
};
exports.logout = logout;
//# sourceMappingURL=logout.js.map