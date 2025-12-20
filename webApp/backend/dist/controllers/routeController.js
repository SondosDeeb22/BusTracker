"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteController = void 0;
const routeService_1 = require("../services/routeService");
const routeService = new routeService_1.RouteService();
//============================================================================================================================================================
class RouteController {
    // =================================================================================================================================
    // Add
    async addRoute(req, res) {
        return routeService.addRoute(req, res);
    }
    // =================================================================================================================================
    // Remove
    async removeRoute(req, res) {
        return routeService.removeRoute(req, res);
    }
    // =================================================================================================================================
    //? Update
    // =================================================================================================================================
    async updateRoute(req, res) {
        return routeService.updateRoute(req, res);
    }
    // =================================================================================================================================
    //? View All Routes buses are covering
    // =================================================================================================================================
    async viewAllRoutes(req, res) {
        return routeService.viewRoutes(req, res, true);
    }
    // =================================================================================================================================
    //? View Routes of the operating buese
    // =================================================================================================================================
    async viewOperatingRoutes(req, res) {
        return routeService.viewRoutes(req, res, false);
    }
}
exports.RouteController = RouteController;
//# sourceMappingURL=routeController.js.map