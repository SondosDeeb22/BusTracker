//======================================================================================================================
//? Importing
//======================================================================================================================
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

//======================================================================================================================
//? Helpers
//======================================================================================================================

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

//======================================================================================================================
//? Service
//======================================================================================================================


//======================================================================================================================
//? View schedule (GET)
//======================================================================================================================
export class ScheduleService {
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
                const operatingHours: Array<{ operatingHourId: string; hour: string }> =
                    row?.servicePattern?.operatingHours ?? [];

                const buckets = new Map<string, { time: string; trips: any[] }>();
                for (const oh of operatingHours) {
                    const t = normalizeTime(oh.hour);
                    if (!t) continue;
                    if (!buckets.has(t)) buckets.set(t, { time: t, trips: [] });
                }

                const otherTrips: any[] = [];
                const trips: any[] = row?.trips ?? [];
                for (const trip of trips) {
                    const tripTime = normalizeTime(trip?.time);
                    const bucket = buckets.get(tripTime);
                    if (bucket) {
                        bucket.trips.push(trip);
                    } else {
                        otherTrips.push(trip);
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
                    otherTrips,
                };
            });

            return sendResponse(res, 200, null, mapped);
        } catch (error) {
            return sendResponse(res, 500, `Error occured while fetching schedule ${error}`);
        }
    }
}
