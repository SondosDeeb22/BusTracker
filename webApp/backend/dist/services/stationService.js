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
const routeStationModel_1 = __importDefault(require("../models/routeStationModel"));
const sequelize_1 = require("sequelize");
//import Enums
const stationEnum_1 = require("../enums/stationEnum");
const errors_1 = require("../errors");
// import helpers
const userHelper_1 = require("../helpers/userHelper");
const helper = new userHelper_1.UserHelper();
//===================================================================================================
class StationService {
    //===================================================================================================
    //? function to Add Station
    //===================================================================================================
    async addStation(payload) {
        try {
            await helper.add(stationModel_1.default, payload, {
                nonDuplicateFields: ['stationName'],
                //----------------------------------------------------------------
                transform: async (data) => {
                    const out = { ...data };
                    if (out.stationName) {
                        out.stationName = String(data.stationName).toLowerCase().trim();
                    }
                    out.status = stationEnum_1.status.notCovered;
                    return out;
                },
            });
            return { messageKey: "stations.success.added" };
        }
        catch (error) {
            console.error('Error occured while creating station.', error);
            if (error instanceof errors_1.ValidationError ||
                error instanceof errors_1.ConflictError ||
                error instanceof errors_1.NotFoundError) {
                throw error;
            }
            throw new errors_1.InternalError('common.errors.internal');
        }
    }
    //===================================================================================================
    //? function to Remove Station
    //===================================================================================================
    async removeStation(stationId) {
        await helper.remove(stationModel_1.default, 'id', String(stationId));
        return { messageKey: 'common.crud.removed' };
    }
    //===================================================================================================
    //? function to Update station
    //===================================================================================================
    async updateStation(payload) {
        const result = await helper.update(stationModel_1.default, payload, {
            enumFields: [{ field: "status", enumObj: stationEnum_1.status }]
        });
        return {
            updated: result.updated,
            messageKey: result.updated ? 'common.crud.updated' : 'common.crud.noChanges'
        };
    }
    //===================================================================================================
    //? function to Fetch All Stations
    //===================================================================================================
    async fetchAllStations() {
        try {
            // get all covered stations
            const coveredStationRows = await routeStationModel_1.default.findAll({
                attributes: ['stationId'],
                group: ['stationId']
            });
            const coveredStationIds = coveredStationRows
                .map((row) => String(row.stationId))
                .filter((id) => id.trim().length > 0);
            if (coveredStationIds.length > 0) {
                // update covered stations' status to "covered"
                await stationModel_1.default.update({ status: stationEnum_1.status.covered }, { where: { id: { [sequelize_1.Op.in]: coveredStationIds } } });
                // update stations' status to "notCovered"
                await stationModel_1.default.update({ status: stationEnum_1.status.notCovered }, { where: { id: { [sequelize_1.Op.notIn]: coveredStationIds } } });
            }
            else {
                await stationModel_1.default.update({ status: stationEnum_1.status.notCovered }, { where: {} });
            }
            const stations = await stationModel_1.default.findAll({
                attributes: ['id', 'stationName', 'status', 'latitude', 'longitude']
            });
            return { messageKey: 'stations.success.fetched', data: stations };
        }
        catch (error) {
            console.error('Error occured while fetching stations.', error);
            throw new errors_1.InternalError('common.errors.internal');
        }
    }
}
exports.StationService = StationService;
//# sourceMappingURL=stationService.js.map