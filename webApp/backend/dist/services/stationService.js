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
    async fetchDefaultStationIdsByType(type) {
        const rows = await stationModel_1.default.findAll({
            attributes: ['id'],
            where: { defaultType: type }
        });
        return Array.from(rows)
            .map((station) => String(station?.id))
            .filter((id) => id.trim().length > 0);
    }
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
                    if (out.defaultType === undefined) {
                        out.defaultType = stationEnum_1.defaultType.notDefault;
                    }
                    out.isDefault = out.defaultType !== stationEnum_1.defaultType.notDefault;
                    if (out.isDefault === true) {
                        out.status = stationEnum_1.status.covered;
                    }
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
        const nextPayload = { ...(payload || {}) };
        if (nextPayload.defaultType === undefined) {
            nextPayload.defaultType = stationEnum_1.defaultType.notDefault;
        }
        nextPayload.isDefault = nextPayload.defaultType !== stationEnum_1.defaultType.notDefault;
        if (nextPayload.isDefault === true) {
            nextPayload.status = stationEnum_1.status.covered;
        }
        const result = await helper.update(stationModel_1.default, nextPayload, {
            enumFields: [{ field: "status", enumObj: stationEnum_1.status }]
        });
        // ensure default stations are always covered
        await stationModel_1.default.update({ status: stationEnum_1.status.covered }, { where: { defaultType: { [sequelize_1.Op.not]: stationEnum_1.defaultType.notDefault } } });
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
            // default stations are always covered
            await stationModel_1.default.update({ status: stationEnum_1.status.covered }, { where: { defaultType: { [sequelize_1.Op.not]: stationEnum_1.defaultType.notDefault } } });
            const stations = await stationModel_1.default.findAll({
                attributes: ['id', 'stationName', 'status', 'latitude', 'longitude', 'isDefault', 'defaultType']
            });
            return { messageKey: 'stations.success.fetched', data: stations };
            // -----------------------------------------------------------------------------------
        }
        catch (error) {
            console.error('Error occured while fetching stations.', error);
            throw new errors_1.InternalError('common.errors.internal');
        }
    }
    // =====================================================================================================
    //? Function to fetch default stations (fixed stations - stations that must exists in all routes)
    // ===================================================================================================== 
    async fetchDefaultStations() {
        try {
            const stations = await stationModel_1.default.findAll({
                attributes: ['id'],
                where: { defaultType: { [sequelize_1.Op.not]: stationEnum_1.defaultType.notDefault } }
            });
            const defaultStations = Array.from(stations);
            // return string array of default stations' ids
            const fixedStationIds = defaultStations
                .map((station) => String(station?.id))
                .filter((id) => id.trim().length > 0);
            return { messageKey: 'stations.success.fetched', data: fixedStationIds };
            // -----------------------------------------------------------------------------------
        }
        catch (error) {
            console.error('Error occured while fetching Default Stations', error);
            throw new errors_1.InternalError('common.errors.internal');
        }
    }
    //===================================================================================================
    //? function to Fetch Stations for Route Picker (exclude fixed/default stations)
    //===================================================================================================
    async fetchStationsForPicker() {
        try {
            const defaultStationsResult = await this.fetchDefaultStations();
            const defaultStations = defaultStationsResult.data;
            // -----------------------------------------------------------------
            const stations = await stationModel_1.default.findAll({
                attributes: ['id', 'stationName', 'status', 'latitude', 'longitude', 'isDefault', 'defaultType']
            });
            const filteredStations = stations.filter((station) => {
                const id = String(station?.id);
                const isDefaultByType = String(station?.defaultType) !== String(stationEnum_1.defaultType.notDefault);
                return !isDefaultByType && !defaultStations.includes(id);
            });
            return { messageKey: 'stations.success.fetched', data: filteredStations };
            // -----------------------------------------------------------------------------------
        }
        catch (error) {
            console.error('Error occured while fetching stations for picker.', error);
            throw new errors_1.InternalError('common.errors.internal');
        }
    }
    // ==================================================================================
    //? function to Fetch Default START Stations
    // ==================================================================================
    async fetchDefaultStartStations() {
        try {
            const ids = await this.fetchDefaultStationIdsByType(stationEnum_1.defaultType.start);
            return { messageKey: 'stations.success.fetched', data: ids };
            // -----------------------------------------------------------------------------------
        }
        catch (error) {
            console.error('Error occured while fetching Default Start Stations', error);
            throw new errors_1.InternalError('common.errors.internal');
        }
    }
    // ==================================================================================
    //? function to Fetch Default END Stations
    // ==================================================================================
    async fetchDefaultEndStations() {
        try {
            const ids = await this.fetchDefaultStationIdsByType(stationEnum_1.defaultType.end);
            return { messageKey: 'stations.success.fetched', data: ids };
            // -----------------------------------------------------------------------------------
        }
        catch (error) {
            console.error('Error occured while fetching Default End Stations', error);
            throw new errors_1.InternalError('common.errors.internal');
        }
    }
}
exports.StationService = StationService;
//# sourceMappingURL=stationService.js.map