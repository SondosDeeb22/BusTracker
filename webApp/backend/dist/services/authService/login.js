"use strict";
//==========================================================================================================
//? Import
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// import Models ------------------------------------------------------------------------
const userModel_1 = __importDefault(require("../../models/userModel"));
// import helpers --------------------------------------------------------------------
const authHelpher_1 = __importDefault(require("../../helpers/authHelpher"));
const authHelper = new authHelpher_1.default();
//==========================================================================================================
const login = async (req, res) => {
    try {
        // the provided login data
        const body = req.body;
        const { email, password, } = body;
        //check if the user provided all the needed data
        if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
            return { status: 500, messageKey: "common.errors.validation.fillAllFields" };
        }
        const userEmail = email.trim();
        const userPassword = password;
        //====================================================================================================================================================
        // check if user registed in the system
        const userExists = await userModel_1.default.findOne({
            where: {
                email: userEmail,
            },
        });
        if (!userExists) {
            return { status: 404, messageKey: "auth.login.userNotFound" };
        }
        //=================================================================================================================================================
        // validate the provided password
        const hashedPassword = userExists.hashedPassword;
        if (typeof hashedPassword !== "string") {
            return { status: 500, messageKey: "common.errors.internal" };
        }
        const validPassword = await new Promise((resolve, reject) => {
            bcrypt_1.default.compare(userPassword, hashedPassword, (error, same) => {
                if (error)
                    return reject(error);
                resolve(same);
            });
        });
        let attemptSuccessful;
        let resultMessage;
        let status;
        console.log(userExists.id);
        console.log(userExists.role);
        console.log(userExists.name);
        if (validPassword) {
            authHelper.createLoginSession(res, {
                userID: userExists.id,
                userRole: userExists.role,
                userName: userExists.name,
            });
            attemptSuccessful = true;
            resultMessage = `${userExists.name} logged in`;
            status = 200;
        }
        //=================================================================================================================================================
        else {
            attemptSuccessful = false;
            resultMessage = "password is wrong, please try again";
            status = 401;
        }
        void authHelper.loginAttempt(req, attemptSuccessful, userEmail);
        return { status, messageKey: attemptSuccessful ? "auth.login.success" : "auth.login.invalidCredentials" };
    }
    catch (error) {
        console.error("Error Found while Logging in.", error);
        return { status: 500, messageKey: "common.errors.internal" };
    }
};
exports.login = login;
//# sourceMappingURL=login.js.map