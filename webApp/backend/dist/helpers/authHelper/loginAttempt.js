"use strict";
//==========================================================================================================
//? Import
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAttempt = void 0;
const loginAttempModel_1 = __importDefault(require("../../models/loginAttempModel"));
const ipLocation_1 = require("./ipLocation");
//==========================================================================================================
const loginAttempt = async (req, attemptSuccessful, userEmail) => {
    try {
        const IPaddressAndLocation = await (0, ipLocation_1.getIPaddressAndUserLocation)(req);
        await loginAttempModel_1.default.create({
            userEmail: userEmail,
            IPaddress: IPaddressAndLocation.ip,
            attemptLocation: IPaddressAndLocation.location,
            attemptSuccessful: attemptSuccessful,
            attemptTime: new Date().toTimeString().slice(0, 8),
            attemptDate: new Date(),
        });
    }
    catch (error) {
        console.error("Error occured while storing login attempt.", error);
        return;
    }
};
exports.loginAttempt = loginAttempt;
//# sourceMappingURL=loginAttempt.js.map