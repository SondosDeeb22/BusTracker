//===================================================================================================
//? Import
//===================================================================================================

import { Op } from "sequelize";

import ScheduleModel from "../../models/scheduleModel";
import ScheduledTripsModel from "../../models/scheduledTripsModel";

//helper
import { UserHelper } from "../../helpers/userHelper";
const userHelper = new UserHelper();

import { ConflictError, NotFoundError } from "../../errors";

import { AddScheduledTripInput, AddScheduledTripResult } from "./types";

//===================================================================================================

export const removeScheduledTrip = async (detailedScheduleId: string): Promise<void> => {
    const deletedCount = await ScheduledTripsModel.destroy({ where: { detailedScheduleId } });
    if (deletedCount === 0) {
        throw new NotFoundError("tripForm.errors.notFound");
    }
};

export const addScheduledTrip = async (input: AddScheduledTripInput): Promise<AddScheduledTripResult> => {
    const scheduleExists = await ScheduleModel.findOne({
        where: { scheduleId: input.scheduleId },
        attributes: ["scheduleId"],
    });

    if (!scheduleExists) {
        throw new NotFoundError("schedule.errors.notFound");
    }

    const existingTrip = await ScheduledTripsModel.findOne({
        where: { scheduleId: input.scheduleId, time: input.time, routeId: input.routeId },
        attributes: ["detailedScheduleId", "driverId", "busId"],
    });

    const occupied = await ScheduledTripsModel.findOne({
        where: {
            scheduleId: input.scheduleId,
            time: input.time,
            ...(existingTrip ? { detailedScheduleId: { [Op.ne]: (existingTrip as any).detailedScheduleId } } : {}),
            [Op.or]: [{ driverId: input.driverId }, { busId: input.busId }],
        },
        attributes: ["detailedScheduleId", "driverId", "busId"],
    });

    if (occupied) {
        if ((occupied as any).driverId === input.driverId) {
            throw new ConflictError("tripForm.errors.driverNotAvailable");
        }

        if ((occupied as any).busId === input.busId) {
            throw new ConflictError("tripForm.errors.busNotAvailable");
        }

        throw new ConflictError("tripForm.errors.driverOrBusNotAvailable");
    }

    if (existingTrip) {
        const [updatedCount] = await ScheduledTripsModel.update(
            { driverId: input.driverId, busId: input.busId },
            { where: { detailedScheduleId: (existingTrip as any).detailedScheduleId } }
        );

        if (updatedCount === 0) {
            throw new ConflictError("tripForm.errors.notUpdated");
        }

        return "tripForm.success.updated";
    }

    await userHelper.add(ScheduledTripsModel, {
        scheduleId: input.scheduleId,
        time: input.time,
        routeId: input.routeId,
        driverId: input.driverId,
        busId: input.busId,
    });

    return "tripForm.success.saved";
};
