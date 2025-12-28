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
const messageTemplate_1 = require("../exceptions/messageTemplate");
//===================================================================================================
class StationService {
    //===================================================================================================
    //? function to Add Station
    //===================================================================================================
    async addStation(req, res) {
        try {
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
            (0, messageTemplate_1.sendResponse)(res, 200, "station was Added successfully");
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error Found while creating station. ${error}`);
        }
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
    //===================================================================================================
    //? function to Fetch All Stations
    //===================================================================================================
    async fetchAllStations(req, res) {
        try {
            const stations = await stationModel_1.default.findAll({
                attributes: ['id', 'stationName', 'status', 'latitude', 'longitude']
            });
            res.status(200).json({
                success: true,
                message: 'Stations fetched successfully',
                data: stations
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching stations',
                error: error
            });
        }
    }
}
exports.StationService = StationService;
//# sourceMappingURL=stationService.js.map