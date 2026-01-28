//===================================================================================================
//? Importing
//===================================================================================================
import { Request, Response } from 'express';

import { Op } from 'sequelize';

import { sendResponse } from '../exceptions/messageTemplate';

import ScheduleModel from '../models/scheduleModel';
import ServicePatternModel from '../models/servicePatternModel';
import OperatingHoursModel from '../models/operatingHoursModel';
import ScheduledTripsModel from '../models/scheduledTripsModel';
import RouteModel from '../models/routeModel';
import UserModel from '../models/userModel';
import BusModel from '../models/busModel';

import { UserHelper } from '../helpers/userHelper';
const helper = new UserHelper();

//===================================================================================================
//? Helper
//===================================================================================================

const normalizeTime = (value: unknown): string => {
    if (!value) return '';

    const s = String(value).trim();
    if (!s) return '';

    const parts = s.split(':');
    const hh = (parts[0] ?? '00').padStart(2, '0');
    const mm = (parts[1] ?? '00').padStart(2, '0');
    const ss = (parts[2] ?? '00').padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
};

const calcDayFromDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[d.getDay()] ?? '';
};

// Normalize day key for grouping 
const normalizeDayKey = (value: unknown): string => {
    const raw = String(value ?? '')
        .trim()
        .toLowerCase();

    switch (raw) {
        case 'monday':
            return 'monday';
        case 'tuesday':
            return 'tuesday';
        case 'wednesday':
        case 'wedensday':
            return 'wednesday';
        case 'thursday':
            return 'thursday';
        case 'friday':
            return 'friday';
        case 'saturday':
            return 'saturday';
        case 'sunday':
            return 'sunday';
        default:
            return raw;
    }
};


// ==========================================================================
// Format date for mobile UI
const formatDateForMobileUi = (value: unknown): string => {
    const s = String(value ?? '').trim();
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;

    const two = (v: number) => String(v).padStart(2, '0');
    return `${two(d.getDate())}/${two(d.getMonth() + 1)}/${d.getFullYear()}`;
};

// ==========================================================================
// Normalize time to hour:minute format
const normalizeTimeToHourMinute = (value: unknown): string => {
    const t = normalizeTime(value);
    if (!t) return '';
    const parts = t.split(':');
    const hh = (parts[0] ?? '00').padStart(2, '0');
    const mm = (parts[1] ?? '00').padStart(2, '0');
    return `${hh}:${mm}`;
};

// ==========================================================================
// Parse color to ARGB int

const parseColorToArgbInt = (raw: unknown): number => {
    const s = String(raw ?? '').trim();
    const hex = s.startsWith('#') ? s.slice(1) : s;
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return 0xFF9E9E9E;
    return (0xFF000000 | parseInt(hex, 16)) >>> 0;
};


//===================================================================================================
//? schedule class
//===================================================================================================

export class ScheduleService {

    //===================================================================================================
    //? Fetch schedule (GET)
    // Fetch schedules with their operating hours timeline and scheduled trips
    //===================================================================================================
    
    async getSchedule(req: Request, res: Response) {
        try {
            const where: any = {};

            const dateParam = typeof req.query.date === 'string' ? req.query.date.trim() : '';
            if (dateParam) {
                where.date = dateParam;
            }

            const servicePatternId = typeof req.query.servicePatternId === 'string' ? req.query.servicePatternId.trim() : '';
            if (servicePatternId) {
                where.servicePatternId = servicePatternId;
            }

            const fromDate = typeof req.query.fromDate === 'string' ? req.query.fromDate.trim() : '';
            const toDate = typeof req.query.toDate === 'string' ? req.query.toDate.trim() : '';

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

            const mapped = schedules.map((row: any) => {
                const operatingHours: Array<{ operatingHourId: string; hour: string }> = row?.servicePattern?.operatingHours ?? [];

                const buckets = new Map<string, { time: string; trips: any[] }>();
                for (const oh of operatingHours) {
                    const t = normalizeTime(oh.hour);
                    if (!t) continue;
                    if (!buckets.has(t)) buckets.set(t, { time: t, trips: [] });
                }
                const trips: any[] = row?.trips ?? [];
                for (const trip of trips) {
                    const tripTime = normalizeTime(trip?.time);
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

            return sendResponse(res, 200, null, mapped);
        } catch (error) {
            console.error('Error occured while fetching schedule', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

    //===================================================================================================
    //? Fetch schedule for users (GET)
    // Fetch schedules with their operating hours timeline and scheduled trips
    // (Simplified output: no driver/bus objects)
    //===================================================================================================
    
    async getUserSchedule(req: Request, res: Response) {
        try {
            const where: any = {};

            const dateParam = typeof req.query.date === 'string' ? req.query.date.trim() : '';
            if (dateParam) {
                where.date = dateParam;
            }

            const servicePatternId = typeof req.query.servicePatternId === 'string' ? req.query.servicePatternId.trim() : '';
            if (servicePatternId) {
                where.servicePatternId = servicePatternId;
            }

            const fromDate = typeof req.query.fromDate === 'string' ? req.query.fromDate.trim() : '';
            const toDate = typeof req.query.toDate === 'string' ? req.query.toDate.trim() : '';

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
                    const t = normalizeTime(oh.hour);
                    if (!t) continue;
                    if (!buckets.has(t)) buckets.set(t, { time: t, trips: [] });
                }
                const trips: any[] = row?.trips ?? [];
                for (const trip of trips) {
                    const tripTime = normalizeTime(trip?.time);
                    const bucket = buckets.get(tripTime);

                    // Keep the trip object simplified for user UI consumption.
                    // We reuse the already-loaded route relation and do not include driver/bus.
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

            // ------------------------------
        
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
                const dayKey = normalizeDayKey(schedule?.day);
                const dateStr = formatDateForMobileUi(schedule?.date);
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
                        .map((oh) => normalizeTimeToHourMinute(oh?.hour))
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
                    const time = normalizeTimeToHourMinute(trip?.time);
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

            // =====================================================================================

            // convert the accumulated data into the final response format
            const response: GroupedDay[] = Array.from(dayAcc.values()).map((day) => {

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

            return sendResponse(res, 200, null, response);
            
        // =============================================================================================
        } catch (error) {
            console.error('Error occured while fetching schedule', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

    
    //===================================================================================================
    //? Remove schedule (Delete)
    //===================================================================================================

    async removeScheduledTrip(req: Request, res: Response) {
        try {
            const detailedScheduleId = typeof req.body?.detailedScheduleId === 'string' ? req.body.detailedScheduleId.trim() : '';
            if (!detailedScheduleId) {
                return sendResponse(res, 500, 'common.validation.required');
            }

            const deletedCount = await ScheduledTripsModel.destroy({ where: { detailedScheduleId } });
            if (deletedCount === 0) {
                return sendResponse(res, 500, 'tripForm.errors.notFound');
            }

            return sendResponse(res, 200, 'tripForm.success.removed');
        } catch (error) {
            console.error('Error occured while removing scheduled trip.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

    //===================================================================================================
    //? add schedule (POST)
    // Create schedule row (date + servicePatternId). day is calculated from date.
    //===================================================================================================

    
    async addSchedule(req: Request, res: Response) {
        try {
            const body = req.body || {};

            const date = typeof body.date === 'string' ? body.date.trim() : '';
            const servicePatternId = typeof body.servicePatternId === 'string' ? body.servicePatternId.trim() : '';

            if (!date || !servicePatternId) {
                return sendResponse(res, 500, 'common.validation.fillAllFields');
            }

            const day = calcDayFromDate(date);
            if (!day) {
                return sendResponse(res, 500, 'schedule.errors.invalidDate');
            }

            await helper.add(req, res, ScheduleModel, { date, day, servicePatternId });
            return;
        } catch (error) {
            console.error('Error occured while creating schedule.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

    //===================================================================================================
    //? add scheduled trip (POST)
    // Add a trip row to a specific schedule.
    //===================================================================================================

    async addScheduledTrip(req: Request, res: Response) {
        try {
            const body = (req.body ?? {}) as {
                scheduleId?: unknown;
                time?: unknown;
                routeId?: unknown;
                driverId?: unknown;
                busId?: unknown;
            };

            const scheduleId = typeof body.scheduleId === 'string' ? body.scheduleId.trim() : '';
            const time = normalizeTime(body.time);
            const routeId = typeof body.routeId === 'string' ? body.routeId.trim() : '';
            const driverId = typeof body.driverId === 'string' ? body.driverId.trim() : '';
            const busId = typeof body.busId === 'string' ? body.busId.trim() : '';

            if (!scheduleId || !time || !routeId || !driverId || !busId) {
                return sendResponse(res, 500, 'common.validation.fillAllFields');
            }

            const scheduleExists = await ScheduleModel.findOne({
                where: { scheduleId },
                attributes: ['scheduleId'],
            });

            if (!scheduleExists) {
                return sendResponse(res, 500, 'schedule.errors.notFound');
            }

            const existingTrip = await ScheduledTripsModel.findOne({
                where: { scheduleId, time, routeId },
                attributes: ['detailedScheduleId', 'driverId', 'busId'],
            });

            const occupied = await ScheduledTripsModel.findOne({
                where: {
                    scheduleId,
                    time,
                    ...(existingTrip ? { detailedScheduleId: { [Op.ne]: existingTrip.detailedScheduleId } } : {}),
                    [Op.or]: [{ driverId }, { busId }],
                },
                attributes: ['detailedScheduleId', 'driverId', 'busId'],
            });

            if (occupied) {
                if (occupied.driverId === driverId) {
                    return sendResponse(res, 500, 'tripForm.errors.driverNotAvailable');
                }

                if (occupied.busId === busId) {
                    return sendResponse(res, 500, 'tripForm.errors.busNotAvailable');
                }

                return sendResponse(res, 500, 'tripForm.errors.driverOrBusNotAvailable');
            }

            if (existingTrip) {
                const [updatedCount] = await ScheduledTripsModel.update(
                    { driverId, busId },
                    { where: { detailedScheduleId: existingTrip.detailedScheduleId } }
                );

                if (updatedCount === 0) {
                    return sendResponse(res, 500, 'tripForm.errors.notUpdated');
                }

                return sendResponse(res, 200, 'tripForm.success.updated');
            }

            await helper.add(
                req,
                res,
                ScheduledTripsModel,
                { scheduleId, time, routeId, driverId, busId },
                { successMessageKey: 'tripForm.success.saved' }
            );
            return;
        } catch (error) {
            console.error('Error occured while creating scheduled trip.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

    //===================================================================================================
    //? update schedule (Patch)
    // Update schedule row. (scheduleId required)
    //===================================================================================================
    
    async updateSchedule(req: Request, res: Response) {
        try {
            const body = req.body || {};
            const scheduleId = typeof body.scheduleId === 'string' ? body.scheduleId.trim() : '';
            if (!scheduleId) {
                return sendResponse(res, 500, 'common.validation.required');
            }

            const updates: any = { scheduleId };

            if (body.date) {
                const date = String(body.date).trim();
                const day = calcDayFromDate(date);
                if (!day) return sendResponse(res, 500, 'schedule.errors.invalidDate');
                updates.date = date;
                updates.day = day;
            }

            if (body.servicePatternId) {
                updates.servicePatternId = String(body.servicePatternId).trim();
            }

            await helper.update(req, res, ScheduleModel, updates);
            return;
        } catch (error) {
            console.error('Error occured while updating schedule.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

    //===================================================================================================
    //? Delete schedule (Delete)
    // Delete schedule row (scheduleId). trips are deleted by DB cascade.
    //===================================================================================================

    async removeSchedule(req: Request, res: Response) {
        try {
            const scheduleId = typeof req.body?.scheduleId === 'string' ? req.body.scheduleId.trim() : '';
            if (!scheduleId) {
                return sendResponse(res, 500, 'common.validation.required');
            }

            await helper.remove(req, res, ScheduleModel, 'scheduleId', scheduleId);
            return;
        } catch (error) {
            console.error('Error occured while removing schedule.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }
}
