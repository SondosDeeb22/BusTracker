"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePatternController = void 0;
const servicePatternService_1 = require("../services/servicePatternService");
//======================================================================================================================
//? Setup
//======================================================================================================================
const servicePatternService = new servicePatternService_1.ServicePatternService();
//======================================================================================================================
//? Controller
//======================================================================================================================
class ServicePatternController {
    //==================================================================================================================
    //? Get service patterns with operating hours
    //==================================================================================================================
    async getServicePatterns(req, res) {
        return servicePatternService.getServicePatterns(req, res);
    }
    //==================================================================================================================
    //? Add service pattern with operating hours
    //==================================================================================================================
    async addServicePattern(req, res) {
        return servicePatternService.addServicePattern(req, res);
    }
    //==================================================================================================================
    //? Update service pattern with operating hours
    //==================================================================================================================
    async updateServicePattern(req, res) {
        return servicePatternService.updateServicePattern(req, res);
    }
    //==================================================================================================================
    //? Delete service pattern with operating hours
    //==================================================================================================================
    async deleteServicePattern(req, res) {
        return servicePatternService.deleteServicePattern(req, res);
    }
}
exports.ServicePatternController = ServicePatternController;
//# sourceMappingURL=servicePatternController.js.map