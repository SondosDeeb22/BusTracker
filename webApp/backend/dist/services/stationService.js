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
const errors_1 = require("../errors");
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
            await helper.add(stationModel_1.default, req.body, {
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
            return (0, messageTemplate_1.sendResponse)(res, 200, "stations.success.added");
        }
        catch (error) {
            console.error('Error occured while creating station.', error);
            if (error instanceof errors_1.ValidationError) {
                if (error.message === 'fillAllFields')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.fillAllFields');
                if (error.message === 'invalidField')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
                if (error.message === 'required')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.noData');
                return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            if (error instanceof errors_1.ConflictError) {
                return (0, messageTemplate_1.sendResponse)(res, 409, error.message);
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? function to Remove Station
    //===================================================================================================
    async removeStation(req, res) {
        try {
            await helper.remove(stationModel_1.default, 'id', req.body.id);
            return (0, messageTemplate_1.sendResponse)(res, 200, 'common.crud.removed');
            //==============================================
        }
        catch (error) {
            console.error('Error occured while removing station.', error);
            if (error instanceof errors_1.ValidationError) {
                if (error.message === 'required')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.required');
                return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? function to Update station
    //===================================================================================================
    async updateStation(req, res) {
        try {
            const result = await helper.update(stationModel_1.default, req.body, {
                enumFields: [{ field: "status", enumObj: stationEnum_1.status }]
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, result.updated ? 'common.crud.updated' : 'common.crud.noChanges');
            //==============================================
        }
        catch (error) {
            console.error('Error occured while updating station.', error);
            if (error instanceof errors_1.ValidationError) {
                if (error.message === 'required')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.noData');
                if (error.message === 'invalidField')
                    return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
                return (0, messageTemplate_1.sendResponse)(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof errors_1.NotFoundError) {
                return (0, messageTemplate_1.sendResponse)(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return (0, messageTemplate_1.sendResponse)(res, 500, error.message);
                }
            }
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? function to Fetch All Stations
    //===================================================================================================
    async fetchAllStations(req, res) {
        try {
            const stations = await stationModel_1.default.findAll({
                attributes: ['id', 'stationName', 'status', 'latitude', 'longitude']
            });
            return (0, messageTemplate_1.sendResponse)(res, 200, 'stations.success.fetched', stations);
        }
        catch (error) {
            console.error('Error occured while fetching stations.', error);
            return (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
}
exports.StationService = StationService;
//# sourceMappingURL=stationService.js.map