"use strict";
//==========================================================================================================
//? Import Sections
//==========================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusService = void 0;
//import models
const busModel_1 = __importDefault(require("../models/busModel"));
//import Enums
const busEnum_1 = require("../enums/busEnum");
const userHelper_1 = require("../helpers/userHelper");
const helper = new userHelper_1.UserHelper();
//===================================================================================================================================================
class BusService {
    //===================================================================================================
    //? function to Add Bus
    //===================================================================================================
    async addBus(req, res) {
        await helper.add(req, res, busModel_1.default, req.body, {
            nonDuplicateFields: ['serialNumber'],
            enumFields: [{ field: "status", enumObj: busEnum_1.status }],
        });
    }
    //===================================================================================================
    //? function to Remove Bus
    //===================================================================================================
    async removeBus(req, res) {
        await helper.remove(req, res, busModel_1.default, 'id', req.body.id);
    }
    //===================================================================================================
    //? function to Update Bus
    //===================================================================================================
    async updateBus(req, res) {
        await helper.update(req, res, busModel_1.default, req.body, {
            enumFields: [{ field: "status", enumObj: busEnum_1.status }],
            //---------------------------------------------
            successMessage: 'Bus was updated',
        });
    }
}
exports.BusService = BusService;
//# sourceMappingURL=busService.js.map