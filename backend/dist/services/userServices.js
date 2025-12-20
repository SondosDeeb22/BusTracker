"use strict";
//===================================================================================================
//? Importing
//===================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
//import models
const userModel_1 = __importDefault(require("../models/userModel"));
const tokenNameEnum_1 = require("../enums/tokenNameEnum");
// import helpers
const userHelper_1 = require("../helpers/userHelper");
const userhelper = new userHelper_1.UserHelper();
const busService_1 = require("./busService");
const busService = new busService_1.BusService();
const authHelpher_1 = __importDefault(require("../helpers/authHelpher"));
const authHelper = new authHelpher_1.default();
const messageTemplate_1 = require("../exceptions/messageTemplate");
//===================================================================================================
class UserService {
    //===================================================================================================
    //? function to change app language
    //===================================================================================================
    async changeLanguage(req, res) {
        try {
            const body = req.body;
            //check if JWT exists in .env file
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if (!jwtLoginKey) {
                (0, messageTemplate_1.sendResponse)(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
                return;
            }
            const userData = authHelper.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
            if (typeof userData === "string") { // when userData is string (so it's not object that contains users data ). then, we  return the error message and stop the function 
                (0, messageTemplate_1.sendResponse)(res, 500, userData); // userData here is Error message , check authHelper.ts file
                return;
            }
            if (typeof userData === "string") {
                (0, messageTemplate_1.sendResponse)(res, 500, userData);
                return;
            }
            // await userhelper.update(req, res, userModel, 'id', userData.userID, {language: body.language} )
            await userhelper.update(req, res, userModel_1.default, { language: body.language });
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while changing language. ${error}`);
            return;
        }
    }
    //===================================================================================================
    //? function to change app apperacne 
    //===================================================================================================
    async changeAppearance(req, res) {
        try {
            const body = req.body;
            //check if JWT exists in .env file
            const jwtLoginKey = process.env.JWT_LOGIN_KEY;
            if (!jwtLoginKey) {
                (0, messageTemplate_1.sendResponse)(res, 500, `JWT_LOGIN_KEY is not defined : ${jwtLoginKey}`);
                return;
            }
            const userData = authHelper.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
            if (typeof userData === "string") {
                (0, messageTemplate_1.sendResponse)(res, 500, userData);
                return;
            }
            // await userhelper.update(req, res, userModel, 'id', userData.userID, {appearance: body.appearance} )
            await userhelper.update(req, res, userModel_1.default, { appearance: body.appearance });
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while changing appearance. ${error}`);
            return;
        }
    }
    // =================================================================================================================================
    //? change route (by driver)
    //===================================================================================================================    
    async changeRoute(req, res) {
        try {
            const legitDriver = await authHelper.validateUser(req, res, req.body.id);
            if (!legitDriver) {
                return;
            }
            await busService.updateBus(req, res);
            //====================================================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while changing route. ${error}`);
            return;
        }
    }
    // =================================================================================================================================
    //? start/ stop bus (by driver)
    //===================================================================================================================    
    async updateBusStatus(req, res) {
        try {
            const legitDriver = await authHelper.validateUser(req, res, req.body.id);
            if (!legitDriver) {
                return;
            }
            await busService.updateBus(req, res);
            //====================================================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while changing route. ${error}`);
            return;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userServices.js.map