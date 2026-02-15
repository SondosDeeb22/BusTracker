"use strict";
//===================================================================================================
//? Importing
//===================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveLocationService = void 0;
const liveLocationModel_1 = __importDefault(require("../models/liveLocationModel"));
const busModel_1 = __importDefault(require("../models/busModel"));
const errors_1 = require("../errors");
//===================================================================================================
class LiveLocationService {
    //===================================================================================================
    //? Update Live Location (create if not exists)
    //===================================================================================================
    async updateLiveLocation(payload) {
        try {
            const body = (payload ?? {});
            const busId = typeof body.busId === 'string' ? body.busId.trim() : '';
            if (!busId) {
                throw new errors_1.ValidationError('common.errors.validation.required');
            }
            // ensure busId related to existed bus
            const busExists = await busModel_1.default.findByPk(busId);
            if (!busExists) {
                throw new errors_1.NotFoundError('common.errors.notFound');
            }
            const latitudeRaw = body.latitude;
            const longitudeRaw = body.longitude;
            const lastUpdateRaw = body.lastUpdate;
            const latitude = latitudeRaw === null || latitudeRaw === undefined
                ? null
                : (typeof latitudeRaw === 'number' ? latitudeRaw : Number(latitudeRaw));
            const longitude = longitudeRaw === null || longitudeRaw === undefined
                ? null
                : (typeof longitudeRaw === 'number' ? longitudeRaw : Number(longitudeRaw));
            if (latitude !== null && !Number.isFinite(latitude)) {
                throw new errors_1.ValidationError('common.errors.validation.invalid');
            }
            if (longitude !== null && !Number.isFinite(longitude)) {
                throw new errors_1.ValidationError('common.errors.validation.invalid');
            }
            const lastUpdate = lastUpdateRaw === null || lastUpdateRaw === undefined
                ? null
                : new Date(String(lastUpdateRaw));
            if (lastUpdate !== null && Number.isNaN(lastUpdate.getTime())) {
                throw new errors_1.ValidationError('common.errors.validation.invalid');
            }
            // check if bus has already reocrd in live_location table
            const existing = await liveLocationModel_1.default.findByPk(busId);
            if (!existing) {
                const created = await liveLocationModel_1.default.create({
                    busId,
                    latitude,
                    longitude,
                    lastUpdate,
                });
                return { messageKey: 'common.crud.updated', data: created };
            }
            await existing.update({
                latitude,
                longitude,
                lastUpdate,
            });
            return { messageKey: 'common.crud.updated', data: existing };
            // ---------------------------------------------------------------------------------
        }
        catch (error) {
            if (error instanceof errors_1.ValidationError) {
                throw error;
            }
            if (error instanceof errors_1.NotFoundError) {
                throw error;
            }
            throw new errors_1.InternalError('common.errors.internal');
        }
    }
}
exports.LiveLocationService = LiveLocationService;
//# sourceMappingURL=liveLocationService.js.map