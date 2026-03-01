"use strict";
//==========================================================================================================
//? Import
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserById = void 0;
const busModel_1 = __importDefault(require("../../models/busModel"));
const errors_1 = require("../../errors");
//==========================================================================================================
const validateUserById = async (driverId, busId) => {
    try {
        if (!busId) {
            throw new errors_1.ForbiddenError("common.errors.forbidden");
        }
        void driverId;
        const userauthorized = await busModel_1.default.findOne({
            where: {
                id: busId,
            },
            attributes: ['id'],
        });
        if (!userauthorized) {
            throw new errors_1.ForbiddenError("common.errors.forbidden");
        }
        return true;
    }
    catch (error) {
        console.error("Error occured while validating user/bus relation", error);
        throw error;
    }
};
exports.validateUserById = validateUserById;
//# sourceMappingURL=driverAuth.js.map