"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePatternService = void 0;
const getServicePatterns_1 = require("./servicePatternService/getServicePatterns");
const addServicePattern_1 = require("./servicePatternService/addServicePattern");
const updateServicePattern_1 = require("./servicePatternService/updateServicePattern");
const deleteServicePattern_1 = require("./servicePatternService/deleteServicePattern");
//======================================================================================================================
//? Types
//======================================================================================================================
//======================================================================================================================
//? Service
//======================================================================================================================
class ServicePatternService {
    //==================================================================================================================
    //? Fetch all service patterns with their operating hours
    //==================================================================================================================
    async getServicePatterns() {
        return (0, getServicePatterns_1.getServicePatterns)();
    }
    //==================================================================================================================
    //? Add service pattern with operating hours
    //==================================================================================================================
    async addServicePattern(payload) {
        return (0, addServicePattern_1.addServicePattern)(payload);
    }
    //==================================================================================================================
    //? Update service pattern (title + operating hours)
    //==================================================================================================================
    async updateServicePattern(payload) {
        return (0, updateServicePattern_1.updateServicePattern)(payload);
    }
    //==================================================================================================================
    //? Delete service pattern with operating hours
    //==================================================================================================================
    async deleteServicePattern(servicePatternIdRaw) {
        return (0, deleteServicePattern_1.deleteServicePattern)(servicePatternIdRaw);
    }
}
exports.ServicePatternService = ServicePatternService;
//# sourceMappingURL=servicePatternService.js.map