"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePatternController = void 0;
const servicePatternService_1 = require("../services/servicePatternService");
const messageTemplate_1 = require("../exceptions/messageTemplate");
const controllerErrorMapper_1 = require("./controllerErrorMapper");
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
        try {
            const result = await servicePatternService.getServicePatterns();
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey, result.data);
            return;
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    //==================================================================================================================
    //? Add service pattern with operating hours
    //==================================================================================================================
    async addServicePattern(req, res) {
        try {
            const result = await servicePatternService.addServicePattern(req.body);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey, result.data);
            return;
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    //==================================================================================================================
    //? Update service pattern with operating hours
    //==================================================================================================================
    async updateServicePattern(req, res) {
        try {
            const result = await servicePatternService.updateServicePattern(req.body);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey, result.data);
            return;
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
    //==================================================================================================================
    //? Delete service pattern with operating hours
    //==================================================================================================================
    async deleteServicePattern(req, res) {
        try {
            const servicePatternIdRaw = req.body?.servicePatternId ?? req.body?.id ?? req.query?.servicePatternId;
            const result = await servicePatternService.deleteServicePattern(servicePatternIdRaw);
            (0, messageTemplate_1.sendResponse)(res, 200, result.messageKey);
            return;
        }
        catch (error) {
            (0, controllerErrorMapper_1.handleControllerError)(res, error);
            return;
        }
    }
}
exports.ServicePatternController = ServicePatternController;
//# sourceMappingURL=servicePatternController.js.map