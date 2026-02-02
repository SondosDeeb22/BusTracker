//===================================================================================================
//? Importing
//===================================================================================================
import { Op } from 'sequelize';

import ScheduleModel from '../models/scheduleModel';
import ServicePatternModel from '../models/servicePatternModel';
import OperatingHoursModel from '../models/operatingHoursModel';
import ScheduledTripsModel from '../models/scheduledTripsModel';
import RouteModel from '../models/routeModel';
import UserModel from '../models/userModel';
import BusModel from '../models/busModel';

//helper
import { UserHelper } from '../helpers/userHelper';
const userHelper = new UserHelper();

import { ScheduleHelper } from '../helpers/scheduleHelper';
import { ConflictError, NotFoundError } from '../errors';
const schedulehelper = new ScheduleHelper();

//===================================================================================================
//? schedule class
//===================================================================================================

export class ScheduleService {

    //===================================================================================================
    //? Fetch schedule (GET)
    // Fetch schedules with their operating hours timeline and scheduled trips
    //===================================================================================================

    async getSchedule(params: {
        date?: string;
        servicePatternId?: string;
        fromDate?: string;
        toDate?: string;
    }) {
        const where: any = {};

        const dateParam = typeof params.date === 'string' ? params.date.trim() : '';
        if (dateParam) {
            where.date = dateParam;
        }

        const servicePatternId = typeof params.servicePatternId === 'string' ? params.servicePatternId.trim() : '';
        if (servicePatternId) {
            where.servicePatternId = servicePatternId;
        }

        const fromDate = typeof params.fromDate === 'string' ? params.fromDate.trim() : '';
        const toDate = typeof params.toDate === 'string' ? params.toDate.trim() : '';

        if (fromDate || toDate) {
            where.date = {
                ...(fromDate ? { [Op.gte]: fromDate } : {}),
                ...(toDate ? { [Op.lte]: toDate } : {}),
            };
        }

        const schedules = await ScheduleModel.findAll({
            where,
            include: [
                {
                    model: ServicePatternModel,
                    as: 'servicePattern',
                    attributes: ['servicePatternId', 'title'],
                    include: [
                        {
                            model: OperatingHoursModel,
                            as: 'operatingHours',
                            attributes: ['operatingHourId', 'hour'],
                        },
                    ],
                },
                {
                    model: ScheduledTripsModel,
                    as: 'trips',
                    attributes: ['detailedScheduleId', 'scheduleId', 'time', 'routeId', 'driverId', 'busId'],
                    include: [
                        {
                            model: RouteModel,
                            as: 'route',
                            attributes: ['id', 'title', 'color'],
                        },
                        {
                            model: UserModel,
                            as: 'driver',
                            attributes: ['id', 'name'],
                        },
                        {
                            model: BusModel,
                            as: 'bus',
                            attributes: ['id', 'plate', 'brand', 'status'],
                        },
                    ],
                },
            ],
            order: [
                ['date', 'ASC'],
                [{ model: ScheduledTripsModel, as: 'trips' }, 'time', 'ASC'],
            ],
        });

        return schedules.map((row: any) => {
            const operatingHours: Array<{ operatingHourId: string; hour: string }> = row?.servicePattern?.operatingHours ?? [];

            const buckets = new Map<string, { time: string; trips: any[] }>();
            for (const oh of operatingHours) {
                const t = schedulehelper.normalizeTime(oh.hour);
                if (!t) continue;
                if (!buckets.has(t)) buckets.set(t, { time: t, trips: [] });
            }
            const trips: any[] = row?.trips ?? [];
            for (const trip of trips) {
                const tripTime = schedulehelper.normalizeTime(trip?.time);
                const bucket = buckets.get(tripTime);
                if (bucket) {
                    bucket.trips.push(trip);
                }
            }

            const timeline = Array.from(buckets.values()).sort((a, b) => a.time.localeCompare(b.time));

            return {
                scheduleId: row.scheduleId,
                date: row.date,
                day: row.day,
                servicePatternId: row.servicePatternId,
                servicePattern: row.servicePattern,
                timeline,
            };
        });
    }

    //===================================================================================================
    //? Fetch schedule for users (GET)
    // Fetch schedules with their operating hours timeline and scheduled trips
    // (Simplified output: no driver/bus objects)
    //===================================================================================================

    async getUserSchedule(params: {
        date?: string;
        servicePatternId?: string;
        fromDate?: string;
        toDate?: string;
    }) {
        const where: any = {};

        const dateParam = typeof params.date === 'string' ? params.date.trim() : '';
        if (dateParam) {
            where.date = dateParam;
        }

        const servicePatternId = typeof params.servicePatternId === 'string' ? params.servicePatternId.trim() : '';
        if (servicePatternId) {
            where.servicePatternId = servicePatternId;
        }

        const fromDate = typeof params.fromDate === 'string' ? params.fromDate.trim() : '';
        const toDate = typeof params.toDate === 'string' ? params.toDate.trim() : '';

        if (fromDate || toDate) {
            where.date = {
                ...(fromDate ? { [Op.gte]: fromDate } : {}),
                ...(toDate ? { [Op.lte]: toDate } : {}),
            };
        }

        const schedules = await ScheduleModel.findAll({
            where,
            include: [
                {
                    model: ServicePatternModel,
                    as: 'servicePattern',
                    attributes: ['servicePatternId', 'title'],
                    include: [
                        {
                            model: OperatingHoursModel,
                            as: 'operatingHours',
                            attributes: ['operatingHourId', 'hour'],
                        },
                    ],
                },
                {
                    model: ScheduledTripsModel,
                    as: 'trips',
                    attributes: ['time', 'routeId'],
                    include: [
                        {
                            model: RouteModel,
                            as: 'route',
                            attributes: ['id', 'title', 'color'],
                        },
                    ],
                },
            ],
            order: [
                ['date', 'ASC'],
                [{ model: ScheduledTripsModel, as: 'trips' }, 'time', 'ASC'],
            ],
        });

        const mapped = schedules.map((row: any) => {
            const operatingHours: Array<{ operatingHourId: string; hour: string }> = row?.servicePattern?.operatingHours ?? [];

            const buckets = new Map<string, { time: string; trips: any[] }>();
            for (const oh of operatingHours) {
                const t = schedulehelper.normalizeTime(oh.hour);
                if (!t) continue;
                if (!buckets.has(t)) buckets.set(t, { time: t, trips: [] });
            }
            const trips: any[] = row?.trips ?? [];
            for (const trip of trips) {
                const tripTime = schedulehelper.normalizeTime(trip?.time);
                const bucket = buckets.get(tripTime);

                // Keep the trip object simplified for user UI consumption
                // We reuse the already-loaded route relation and do not include driver/bus
                const simplifiedTrip = {
                    time: tripTime,
                    route: trip?.route,
                };

                if (bucket) {
                    bucket.trips.push(simplifiedTrip);
                }
            }

            const timeline = Array.from(buckets.values()).sort((a, b) => a.time.localeCompare(b.time));

            return {
                scheduleId: row.scheduleId,
                date: row.date,
                day: row.day,
                servicePatternId: row.servicePatternId,
                servicePattern: row.servicePattern,
                timeline,
            };
        });

        // ==============================================================================================
        // Group schedules into the mobile UI shape:
        // Day -> Service Patterns -> Routes -> Departure Times
        // ==============================================================================================

        type GroupedRoute = { routeName: string; tabColorValue: number; departureTimes: string[] };
        type GroupedServicePattern = {
            servicePatternId: string;
            title: string;
            operatingTimes: string[];
            routes: GroupedRoute[];
        };
        type GroupedDay = {
            dayKey: string;
            date: string;
            servicePatterns: GroupedServicePattern[];
        };

        const dayAcc = new Map<
            string,
            {
                dayKey: string;
                date: string;
                servicePatterns: Map<
                    string,
                    {
                        servicePatternId: string;
                        title: string;
                        operatingTimes: string[];
                        routesAcc: Map<string, { routeName: string; tabColorValue: number; times: Set<string> }>;
                    }
                >;
            }
        >();

        // ==============================================================================================
        // here we are organizing the teh routes under the correct day and service pattern
        // the loop processes each schedule, gropuing it into the matching day and service pattern within the day accumulator map "dayAcc" we defined before
        
        for (const schedule of mapped) {

            // extract day and date information and normailzing them to united format 
            const dayKey = schedulehelper.normalizeDayKey(schedule?.day);
            const dateStr = schedulehelper.formatDateForMobileUi(schedule?.date);
            const dayId = `${dayKey}|${dateStr}`;

            //________________________________________________

            // check if the dayId is already exists in the accumulator, if not we create new entry
            if (!dayAcc.has(dayId)) {
                dayAcc.set(dayId, {
                    dayKey,
                    date: dateStr,
                    servicePatterns: new Map(),
                });
            }

            // --------------------------------------------------------------------------------------

            const day = dayAcc.get(dayId)!;

            // extract service pattern id and title from the schedule instance 
            const spId = typeof schedule?.servicePatternId === 'string' ? schedule.servicePatternId.trim() : '';
            const spTitle = typeof schedule?.servicePattern?.title === 'string' ? schedule.servicePattern.title.trim() : '';
            const spKey = spId || spTitle;
            //________________________________________________

            // check if the servicePatternId exists already, if not create new entry to that service pattern wihtin this day
            if (!spKey) continue;

            // creating service pattern entry 
            if (!day.servicePatterns.has(spKey)) {
                // get operating hours
                const operatingHoursRaw: any[] = Array.isArray(schedule?.servicePattern?.operatingHours)
                    ? schedule.servicePattern.operatingHours
                    : [];
                const operatingTimes = operatingHoursRaw
                    .map((oh) => schedulehelper.normalizeTimeToHourMinute(oh?.hour))
                    .filter((t) => Boolean(t))
                    .sort((a, b) => String(a).localeCompare(String(b)));

                day.servicePatterns.set(spKey, {
                    servicePatternId: spId,
                    title: spTitle,
                    operatingTimes,
                    routesAcc: new Map(),
                });
            }
            //-----------------------------------------------------

            // get service pattern id
            const sp = day.servicePatterns.get(spKey)!;

            // handle trip data
            const ingestTrip = (trip: any) => {

                const route = trip?.route;
                const routeName = typeof route?.title === 'string' ? route.title.trim() : '';
                if (!routeName) return;

                // get trip time
                const time = schedulehelper.normalizeTimeToHourMinute(trip?.time);
                if (!time) return;

                // check if the route exists already, if not create new entry to that route within this service pattern within this day
                if (!sp.routesAcc.has(routeName)) {
                    sp.routesAcc.set(routeName, {
                        routeName,
                        tabColorValue: route?.color,
                        times: new Set<string>(),
                    });
                }

                // after confirming the route exists , we add the current trips times to the route's list of times
                sp.routesAcc.get(routeName)!.times.add(time);
            };

                //-----------------------------------------------

            // get timeline trips
            const timeline: any[] = Array.isArray(schedule?.timeline) ? schedule.timeline : [];
                  
            // Loop through all teh timeline slots for this scheudle (to add their routes and departure times)
            for (const slot of timeline) {
                const trips: any[] = Array.isArray(slot?.trips) ? slot.trips : [];
                for (const trip of trips) {
                    ingestTrip(trip);
                }
            }
        }

        return Array.from(dayAcc.values()).map((day) => {
            const servicePatterns: GroupedServicePattern[] = Array.from(day.servicePatterns.values()).map((sp) => {
                const routes: GroupedRoute[] = Array.from(sp.routesAcc.values()).map((r) => ({
                    routeName: r.routeName,
                    tabColorValue: r.tabColorValue,
                    departureTimes: Array.from(r.times).sort((a, b) => a.localeCompare(b)),
                }));

                return {
                    servicePatternId: sp.servicePatternId,
                    title: sp.title,
                    operatingTimes: sp.operatingTimes,
                    routes,
                };
            });

            return {
                dayKey: day.dayKey,
                date: day.date,
                servicePatterns,
            };
        });
    }

    //===================================================================================================
    //? Remove schedule (Delete)
    //===================================================================================================

    async removeScheduledTrip(detailedScheduleId: string) {
        const deletedCount = await ScheduledTripsModel.destroy({ where: { detailedScheduleId } });
        if (deletedCount === 0) {
            throw new NotFoundError('tripForm.errors.notFound');
        }
    }

    //===================================================================================================
    //? add schedule (POST)
    // Create schedule row (date + servicePatternId). day is calculated from date.
    //===================================================================================================

    async addSchedule(input: { date: string; day: string; servicePatternId: string }) {
        await userHelper.add(ScheduleModel, { date: input.date, day: input.day, servicePatternId: input.servicePatternId });
    }

    //===================================================================================================
    //? add scheduled trip (POST)
    // Add a trip row to a specific schedule.
    //===================================================================================================

    async addScheduledTrip(input: {
        scheduleId: string;
        time: string;
        routeId: string;
        driverId: string;
        busId: string;
    }): Promise<'tripForm.success.saved' | 'tripForm.success.updated'> {
        const scheduleExists = await ScheduleModel.findOne({
            where: { scheduleId: input.scheduleId },
            attributes: ['scheduleId'],
        });

        if (!scheduleExists) {
            throw new NotFoundError('schedule.errors.notFound');
        }

        const existingTrip = await ScheduledTripsModel.findOne({
            where: { scheduleId: input.scheduleId, time: input.time, routeId: input.routeId },
            attributes: ['detailedScheduleId', 'driverId', 'busId'],
        });

        const occupied = await ScheduledTripsModel.findOne({
            where: {
                scheduleId: input.scheduleId,
                time: input.time,
                ...(existingTrip ? { detailedScheduleId: { [Op.ne]: existingTrip.detailedScheduleId } } : {}),
                [Op.or]: [{ driverId: input.driverId }, { busId: input.busId }],
            },
            attributes: ['detailedScheduleId', 'driverId', 'busId'],
        });

        if (occupied) {
            if (occupied.driverId === input.driverId) {
                throw new ConflictError('tripForm.errors.driverNotAvailable');
            }

            if (occupied.busId === input.busId) {
                throw new ConflictError('tripForm.errors.busNotAvailable');
            }

            throw new ConflictError('tripForm.errors.driverOrBusNotAvailable');
        }

        if (existingTrip) {
            const [updatedCount] = await ScheduledTripsModel.update(
                { driverId: input.driverId, busId: input.busId },
                { where: { detailedScheduleId: existingTrip.detailedScheduleId } }
            );

            if (updatedCount === 0) {
                throw new ConflictError('tripForm.errors.notUpdated');
            }

            return 'tripForm.success.updated';
        }

        await userHelper.add(ScheduledTripsModel, {
            scheduleId: input.scheduleId,
            time: input.time,
            routeId: input.routeId,
            driverId: input.driverId,
            busId: input.busId,
        });

        return 'tripForm.success.saved';
    }

    //===================================================================================================
    //? update schedule (Patch)
    // Update schedule row. (scheduleId required)
    //===================================================================================================

    async updateSchedule(updates: { scheduleId: string; date?: string; day?: string; servicePatternId?: string }) {
        const result = await userHelper.update(ScheduleModel, updates);
        return result.updated;
    }

    //===================================================================================================
    //? Delete schedule (Delete)
    // Delete schedule row (scheduleId). trips are deleted by DB cascade.
    //===================================================================================================

    async removeSchedule(scheduleId: string) {
        await userHelper.remove(ScheduleModel, 'scheduleId', scheduleId);
    }
}
