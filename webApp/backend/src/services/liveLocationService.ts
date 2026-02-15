//===================================================================================================
//? Importing
//===================================================================================================

import LiveLocationModel from "../models/liveLocationModel";
import BusModel from "../models/busModel";

import { InternalError, NotFoundError, ValidationError } from "../errors";

//===================================================================================================

export class LiveLocationService {

    //===================================================================================================
    //? Update Live Location (create if not exists)
    //===================================================================================================

    async updateLiveLocation(payload: unknown): Promise<{ messageKey: string; data: unknown }> {
        try {
            const body = (payload ?? {}) as Record<string, unknown>;

            const busId = typeof body.busId === 'string' ? body.busId.trim() : '';
            if (!busId) {
                throw new ValidationError('common.errors.validation.required');
            }

            // ensure busId related to existed bus
            const busExists = await BusModel.findByPk(busId);
            if (!busExists) {
                throw new NotFoundError('common.errors.notFound');
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
                throw new ValidationError('common.errors.validation.invalid');
            }

            if (longitude !== null && !Number.isFinite(longitude)) {
                throw new ValidationError('common.errors.validation.invalid');
            }

            const lastUpdate = lastUpdateRaw === null || lastUpdateRaw === undefined
                ? null
                : new Date(String(lastUpdateRaw));

            if (lastUpdate !== null && Number.isNaN(lastUpdate.getTime())) {
                throw new ValidationError('common.errors.validation.invalid');
            }

            // check if bus has already reocrd in live_location table
            const existing = await LiveLocationModel.findByPk(busId);

            if (!existing) {
                const created = await LiveLocationModel.create({
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
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new InternalError('common.errors.internal');
        }
    }
}
