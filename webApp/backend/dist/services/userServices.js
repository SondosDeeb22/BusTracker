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
const errors_1 = require("../errors");
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
                console.error('JWT_LOGIN_KEY is not defined');
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
                return;
            }
            const userData = authHelper.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
            const result = await userhelper.update(userModel_1.default, { id: userData.userID, language: body.language });
            return (0, messageTemplate_1.sendResponse)(res, 200, result.updated ? 'common.crud.updated' : 'common.crud.noChanges');
            //=========================================================================================     
        }
        catch (error) {
            console.error('Error occured while changing language.', error);
            if (error instanceof errors_1.UnauthorizedError) {
                return (0, messageTemplate_1.sendResponse)(res, 401, error.message);
            }
            if (error instanceof errors_1.ValidationError) {
                if (error.message === 'required')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.noData');
                if (error.message === 'invalidField')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
                return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
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
                console.error('JWT_LOGIN_KEY is not defined');
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
                return;
            }
            const userData = authHelper.extractJWTData(req, tokenNameEnum_1.loginToken, jwtLoginKey);
            const result = await userhelper.update(userModel_1.default, { id: userData.userID, appearance: body.appearance });
            return (0, messageTemplate_1.sendResponse)(res, 200, result.updated ? 'common.crud.updated' : 'common.crud.noChanges');
            //===============================================     
        }
        catch (error) {
            console.error('Error occured while changing appearance.', error);
            if (error instanceof errors_1.UnauthorizedError) {
                return (0, messageTemplate_1.sendResponse)(res, 401, error.message);
            }
            if (error instanceof errors_1.ValidationError) {
                if (error.message === 'required')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.noData');
                if (error.message === 'invalidField')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
                return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    // =================================================================================================================================
    //? change route (by driver)
    //===================================================================================================================    
    async changeRoute(req, res) {
        try {
            await authHelper.validateUser(req, req.body.id);
            await busService.updateBus(req, res);
            //====================================================================
        }
        catch (error) {
            console.error('Error occured while changing route.', error);
            if (error instanceof errors_1.UnauthorizedError) {
                return (0, messageTemplate_1.sendResponse)(res, 401, error.message);
            }
            if (error instanceof errors_1.ForbiddenError) {
                return (0, messageTemplate_1.sendResponse)(res, 403, error.message);
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    // =================================================================================================================================
    //? start/ stop bus (by driver)
    //===================================================================================================================    
    async updateBusStatus(req, res) {
        try {
            await authHelper.validateUser(req, req.body.id);
            await busService.updateBus(req, res);
            //====================================================================
        }
        catch (error) {
            console.error('Error occured while updating bus status.', error);
            if (error instanceof errors_1.UnauthorizedError) {
                return (0, messageTemplate_1.sendResponse)(res, 401, error.message);
            }
            if (error instanceof errors_1.ForbiddenError) {
                return (0, messageTemplate_1.sendResponse)(res, 403, error.message);
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userServices.js.map