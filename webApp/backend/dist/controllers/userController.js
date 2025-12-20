"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userServices_1 = require("../services/userServices");
const userService = new userServices_1.UserService();
const busService_1 = require("../services/busService");
const busService = new busService_1.BusService();
//============================================================================================================================================================
class UserController {
    // =================================================================================================================================
    // update language
    //===================================================================================================================    
    async changeLanguage(req, res) {
        return userService.changeLanguage(req, res);
    }
    // =================================================================================================================================
    // update apperacne 
    //===================================================================================================================    
    async changeAppearance(req, res) {
        return userService.changeAppearance(req, res);
    }
    // =================================================================================================================================
    // change route (by driver)
    //===================================================================================================================    
    async changeRoute(req, res) {
        return userService.changeRoute(req, res);
    }
    // =================================================================================================================================
    // start/ stop bus (by driver)
    //===================================================================================================================    
    async changeBusStatus(req, res) {
        return userService.updateBusStatus(req, res);
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map