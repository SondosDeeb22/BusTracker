"use strict";
//===================================================================================================
//? Importing
//===================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationService = void 0;
//import models
const stationModel_1 = __importDefault(require("../models/stationModel"));
//import Enums
const stationEnum_1 = require("../enums/stationEnum");
// import helpers
const userHelper_1 = require("../helpers/userHelper");
const helper = new userHelper_1.UserHelper();
//===================================================================================================
class StationService {
    //===================================================================================================
    //? function to Add Station
    //===================================================================================================
    async addStation(req, res) {
        await helper.add(req, res, stationModel_1.default, req.body, {
            nonDuplicateFields: ['stationName'],
            //----------------------------------------------------------------
            transform: async (data) => {
                const out = { ...data };
                if (out.stationName) {
                    out.stationName = data.stationName.toLowerCase().trim();
                }
                return out;
            },
            //----------------------------------------------------------------
            enumFields: [
                { field: "status", enumObj: stationEnum_1.status },
            ],
        });
    }
    //===================================================================================================
    //? function to Remove Station
    //===================================================================================================
    async removeStation(req, res) {
        await helper.remove(req, res, stationModel_1.default, 'id', req.body.id);
    }
    //===================================================================================================
    //? function to Update station
    //===================================================================================================
    async updateStation(req, res) {
        await helper.update(req, res, stationModel_1.default, req.body, {
            enumFields: [{ field: "status", enumObj: stationEnum_1.status },],
            //---------------------------------------------
            successMessage: 'Station was updated',
        });
    }
}
exports.StationService = StationService;
//# sourceMappingURL=stationService.js.map