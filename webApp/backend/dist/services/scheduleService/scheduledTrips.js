"use strict";
//===================================================================================================
//? Import
//===================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScheduledTrip = exports.addScheduledTrip = exports.removeScheduledTrip = void 0;
const sequelize_1 = require("sequelize");
const scheduleModel_1 = __importDefault(require("../../models/scheduleModel"));
const scheduledTripsModel_1 = __importDefault(require("../../models/scheduledTripsModel"));
//helper
const userHelper_1 = require("../../helpers/userHelper");
const userHelper = new userHelper_1.UserHelper();
const errors_1 = require("../../errors");
//===================================================================================================
// ===========================================================================
//? function to remove data
// ===========================================================================
const removeScheduledTrip = async (detailedScheduleId) => {
    const deletedCount = await scheduledTripsModel_1.default.destroy({ where: { detailedScheduleId } });
    if (deletedCount === 0) {
        throw new errors_1.NotFoundError("tripForm.errors.notFound");
    }
};
exports.removeScheduledTrip = removeScheduledTrip;
// ===========================================================================
//? function to add data
// ===========================================================================
const addScheduledTrip = async (input) => {
    const scheduleExists = await scheduleModel_1.default.findOne({
        where: { scheduleId: input.scheduleId },
        attributes: ["scheduleId"],
    });
    if (!scheduleExists) {
        throw new errors_1.NotFoundError("schedule.errors.notFound");
    }
    const existingTrip = await scheduledTripsModel_1.default.findOne({
        where: { scheduleId: input.scheduleId, time: input.time, routeId: input.routeId },
        attributes: ["detailedScheduleId", "driverId", "busId"],
    });
    const occupied = await scheduledTripsModel_1.default.findOne({
        where: {
            scheduleId: input.scheduleId,
            time: input.time,
            ...(existingTrip ? { detailedScheduleId: { [sequelize_1.Op.ne]: existingTrip.detailedScheduleId } } : {}),
            [sequelize_1.Op.or]: [{ driverId: input.driverId }, { busId: input.busId }],
        },
        attributes: ["detailedScheduleId", "driverId", "busId"],
    });
    if (occupied) {
        if (occupied.driverId === input.driverId) {
            throw new errors_1.ConflictError("tripForm.errors.driverNotAvailable");
        }
        if (occupied.busId === input.busId) {
            throw new errors_1.ConflictError("tripForm.errors.busNotAvailable");
        }
        throw new errors_1.ConflictError("tripForm.errors.driverOrBusNotAvailable");
    }
    if (existingTrip) {
        const [updatedCount] = await scheduledTripsModel_1.default.update({ driverId: input.driverId, busId: input.busId }, { where: { detailedScheduleId: existingTrip.detailedScheduleId } });
        if (updatedCount === 0) {
            throw new errors_1.ConflictError("tripForm.errors.notUpdated");
        }
        return "tripForm.success.updated";
    }
    await userHelper.add(scheduledTripsModel_1.default, {
        scheduleId: input.scheduleId,
        time: input.time,
        routeId: input.routeId,
        driverId: input.driverId,
        busId: input.busId,
    });
    return "tripForm.success.saved";
};
exports.addScheduledTrip = addScheduledTrip;
// ===========================================================================
//? function to update data
// ===========================================================================
const updateScheduledTrip = async (input) => {
    const existingTrip = await scheduledTripsModel_1.default.findOne({
        where: { detailedScheduleId: input.detailedScheduleId },
        attributes: ["detailedScheduleId", "scheduleId", "time", "routeId", "driverId", "busId"],
    });
    if (!existingTrip) {
        throw new errors_1.NotFoundError("tripForm.errors.notFound");
    }
    const occupied = await scheduledTripsModel_1.default.findOne({
        where: {
            scheduleId: existingTrip.scheduleId,
            time: existingTrip.time,
            detailedScheduleId: { [sequelize_1.Op.ne]: input.detailedScheduleId },
            [sequelize_1.Op.or]: [{ driverId: input.driverId }, { busId: input.busId }],
        },
        attributes: ["detailedScheduleId", "driverId", "busId"],
    });
    if (occupied) {
        if (occupied.driverId === input.driverId) {
            throw new errors_1.ConflictError("tripForm.errors.driverNotAvailable");
        }
        if (occupied.busId === input.busId) {
            throw new errors_1.ConflictError("tripForm.errors.busNotAvailable");
        }
        throw new errors_1.ConflictError("tripForm.errors.driverOrBusNotAvailable");
    }
    const [updatedCount] = await scheduledTripsModel_1.default.update({ driverId: input.driverId, busId: input.busId }, { where: { detailedScheduleId: input.detailedScheduleId } });
    if (updatedCount === 0) {
        throw new errors_1.ConflictError("tripForm.errors.notUpdated");
    }
    return "tripForm.success.updated";
};
exports.updateScheduledTrip = updateScheduledTrip;
//# sourceMappingURL=scheduledTrips.js.map