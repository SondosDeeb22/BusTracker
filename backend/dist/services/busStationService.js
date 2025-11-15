"use strict";
//===================================================================================================
//? Importing
//===================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusStationService = void 0;
//import models
const stationModel_1 = __importDefault(require("../models/stationModel"));
//import Enums
const busStationEnum_1 = require("../enums/busStationEnum");
// import helpers
const userHelper_1 = require("../helpers/userHelper");
const helper = new userHelper_1.UserHelper();
//===================================================================================================
class BusStationService {
    //===================================================================================================
    //? function to Add bus Station
    //===================================================================================================
    async addBusStation(req, res) {
        await helper.add(req, res, stationModel_1.default, req.body, {
            enumFields: [
                { field: "status", enumObj: busStationEnum_1.status },
            ],
            //-----------------------------------------------------------
            successMessage: 'Bus Station created successfully',
        });
    }
}
exports.BusStationService = BusStationService;
//# sourceMappingURL=busStationService.js.map