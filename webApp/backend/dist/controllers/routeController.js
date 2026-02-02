"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteController = void 0;
const routeService_1 = require("../services/routeService");
const messageTemplate_1 = require("../exceptions/messageTemplate");
const controllerErrorMapper_1 = require("./controllerErrorMapper");
const routeService = new routeService_1.RouteService();
//============================================================================================================================================================
class RouteController {
    // =================================================================================================================================
    // Add
    async addRoute(req, res) {
        try {
            const result = await routeService.addRoute(req.body);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
            // ---------------------------------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    // Remove
    async removeRoute(req, res) {
        try {
            const result = await routeService.removeRoute(req.body?.id);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
            // ---------------------------------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? Update
    // =================================================================================================================================
    async updateRoute(req, res) {
        try {
            const result = await routeService.updateRoute(req.body);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
            // ---------------------------------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? View All Routes buses are covering
    // =================================================================================================================================
    async viewAllRoutes(req, res) {
        try {
            const result = await routeService.viewRoutes(true);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey, result.data);
            return;
            // ---------------------------------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    // =================================================================================================================================
    //? View Routes of the operating buese
    // =================================================================================================================================
    async viewOperatingRoutes(req, res) {
        try {
            const result = await routeService.viewRoutes(false);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey, result.data);
            return;
            // ---------------------------------------
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
}
exports.RouteController = RouteController;
//# sourceMappingURL=routeController.js.map