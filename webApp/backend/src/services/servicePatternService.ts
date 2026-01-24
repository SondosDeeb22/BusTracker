//======================================================================================================================
//? Importing
//======================================================================================================================
import { Request, Response } from 'express';

import { sendResponse } from '../exceptions/messageTemplate';

import ServicePatternModel from '../models/servicePatternModel';
import OperatingHoursModel from '../models/operatingHoursModel';
import ScheduleModel from '../models/scheduleModel';
import ScheduledTripsModel from '../models/scheduledTripsModel';
import { sequelize } from '../config/database';

//======================================================================================================================
//? Types
//======================================================================================================================

type OperatingHourDto = {
    operatingHourId: string;
    hour: string;
};

type ServicePatternDto = {
    servicePatternId: string;
    title: string;
    operatingHours: OperatingHourDto[];
};


//define when the bus system starts and stops operating
const startOperatingHour = 6;
const endOperatingHour = 23;

//define the minute label for operating hours
const startOperatingMinuteLabel = '45';
const operatingMinuteLabel = '15';
//======================================================================================================================
//? Service
//======================================================================================================================

export class ServicePatternService {

    //==================================================================================================================
    //? Fetch all service patterns with their operating hours
    //==================================================================================================================
    async getServicePatterns(req: Request, res: Response) {
        try {
            const rows = await ServicePatternModel.findAll({
                attributes: ['servicePatternId', 'title'],
                include: [
                    {
                        model: OperatingHoursModel,
                        as: 'operatingHours',
                        attributes: ['operatingHourId', 'hour'],
                    },
                ],
                order: [
                    ['servicePatternId', 'ASC'],
                    [{ model: OperatingHoursModel, as: 'operatingHours' }, 'hour', 'ASC'],
                ],
            });

            const data: ServicePatternDto[] = rows.map((row) => {
                const operatingHoursRaw = (row as unknown as { operatingHours?: Array<{ operatingHourId: string; hour: string }> }).operatingHours ?? [];

                return {
                    servicePatternId: row.servicePatternId,
                    title: row.title,
                    operatingHours: operatingHoursRaw.map((oh) => ({
                        operatingHourId: oh.operatingHourId,
                        hour: String(oh.hour),
                    })),
                };
            });

            return sendResponse(res, 200, null, data);
        } catch (error) {
            console.error('Error occured while fetching service patterns.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

    //==================================================================================================================
    //? Add service pattern with operating hours
    //==================================================================================================================
    async addServicePattern(req: Request, res: Response) {
        const titleRaw = req.body?.title;
        const selectedHoursRaw = req.body?.hours;

        const title = typeof titleRaw === 'string' ? titleRaw.trim() : '';
        const hoursArray: unknown[] = Array.isArray(selectedHoursRaw) ? selectedHoursRaw : [];

        if (!title) {
            return sendResponse(res, 500, 'servicePatterns.validation.titleRequired');
        }

        if (hoursArray.length === 0) {
            return sendResponse(res, 500, 'servicePatterns.validation.selectAtLeastOneHour');
        }

        // normalize to unique sorted ints within 0..23
        const hours = Array.from(
            new Set(
                hoursArray
                    .map((h) => (typeof h === 'number' ? h : Number(h)))
                    .filter((h) => Number.isFinite(h) && h >= 0 && h <= endOperatingHour)
            )
        ).sort((a, b) => a - b);

        if (hours.length === 0) {
            return sendResponse(res, 500, 'servicePatterns.validation.invalidHours');
        }

        try {
            const created = await sequelize.transaction(async (t) => {
                // Let UserHelper-style PK generation be mimicked here (4 chars: prefix + 3 digits)
                // ServicePatternModel PK field is `servicePatternId` not `id`, so generate it manually.
                let servicePatternId: string;
                do {
                    const id = Math.floor(100 + Math.random() * 900);
                    servicePatternId = `S${id}`;
                } while (
                    (await ServicePatternModel.count({ where: { servicePatternId }, transaction: t })) !== 0
                );

                await ServicePatternModel.create(
                    {
                        servicePatternId,
                        title,
                    },
                    { transaction: t }
                );

                // Create operating hours rows
                const createdOperatingHours: OperatingHourDto[] = [];

                for (const h of hours) {
                    let operatingHourId: string;
                    do {
                        const id = Math.floor(100 + Math.random() * 900);
                        operatingHourId = `O${id}`;
                    } while (
                        (await OperatingHoursModel.count({ where: { operatingHourId }, transaction: t })) !== 0
                    );

                    // store as 06:45:00 for hour 6, otherwise HH:15:00
                    const minute = h === 6 ? startOperatingMinuteLabel : operatingMinuteLabel;
                    const hour = `${String(h).padStart(2, '0')}:${minute}:00`;

                    await OperatingHoursModel.create(
                        {
                            operatingHourId,
                            servicePatternId,
                            hour,
                        },
                        { transaction: t }
                    );

                    createdOperatingHours.push({ operatingHourId, hour });
                }

                const createdPattern: ServicePatternDto = {
                    servicePatternId,
                    title,
                    operatingHours: createdOperatingHours,
                };

                return createdPattern;
            });

            return sendResponse(res, 200, 'servicePatterns.success.added', created);
        } catch (error) {
            console.error('Error occured while creating service pattern.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

    //==================================================================================================================
    //? Update service pattern (title + operating hours)
    //==================================================================================================================
    async updateServicePattern(req: Request, res: Response) {
        const servicePatternIdRaw = req.body?.servicePatternId;
        const titleRaw = req.body?.title;
        const selectedHoursRaw = req.body?.hours;

        const servicePatternId = typeof servicePatternIdRaw === 'string' ? servicePatternIdRaw.trim() : '';
        const title = typeof titleRaw === 'string' ? titleRaw.trim() : '';
        const hoursArray: unknown[] = Array.isArray(selectedHoursRaw) ? selectedHoursRaw : [];

        if (!servicePatternId) {
            return sendResponse(res, 500, 'servicePatterns.validation.idRequired');
        }

        if (!title) {
            return sendResponse(res, 500, 'servicePatterns.validation.titleRequired');
        }

        if (hoursArray.length === 0) {
            return sendResponse(res, 500, 'servicePatterns.validation.selectAtLeastOneHour');
        }

        const hours = Array.from(
            new Set(
                hoursArray
                    .map((h) => (typeof h === 'number' ? h : Number(h)))
                    .filter((h) => Number.isFinite(h) && h >= startOperatingHour && h <= 23)
            )
        ).sort((a, b) => a - b);

        if (hours.length === 0) {
            return sendResponse(res, 500, 'servicePatterns.validation.invalidHours');
        }

        try {
            const updated = await sequelize.transaction(async (t) => {
                const pattern = await ServicePatternModel.findOne({ where: { servicePatternId }, transaction: t });
                if (!pattern) {
                    return null;
                }

                await ServicePatternModel.update(
                    { title },
                    {
                        where: { servicePatternId },
                        transaction: t,
                    }
                );

                await OperatingHoursModel.destroy({
                    where: { servicePatternId },
                    transaction: t,
                });

                const createdOperatingHours: OperatingHourDto[] = [];
                for (const h of hours) {
                    let operatingHourId: string;
                    do {
                        const id = Math.floor(100 + Math.random() * 900);
                        operatingHourId = `O${id}`;
                    } while (
                        (await OperatingHoursModel.count({ where: { operatingHourId }, transaction: t })) !== 0
                    );

                    const minute = h === 6 ? startOperatingMinuteLabel : operatingMinuteLabel;
                    const hour = `${String(h).padStart(2, '0')}:${minute}:00`;

                    await OperatingHoursModel.create(
                        {
                            operatingHourId,
                            servicePatternId,
                            hour,
                        },
                        { transaction: t }
                    );

                    createdOperatingHours.push({ operatingHourId, hour });
                }

                const out: ServicePatternDto = {
                    servicePatternId,
                    title,
                    operatingHours: createdOperatingHours,
                };

                return out;
            });

            if (!updated) {
                return sendResponse(res, 500, 'servicePatterns.errors.notFound');
            }

            return sendResponse(res, 200, 'servicePatterns.success.updated', updated);
        } catch (error) {
            console.error('Error occured while updating service pattern.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

    //==================================================================================================================
    //? Delete service pattern with operating hours
    //==================================================================================================================


    async deleteServicePattern(req: Request, res: Response) {
        const servicePatternIdRaw = req.body?.servicePatternId ?? req.body?.id ?? req.query?.servicePatternId;
        const servicePatternId = typeof servicePatternIdRaw === 'string' ? servicePatternIdRaw.trim() : '';

        if (!servicePatternId) {
            return sendResponse(res, 500, 'servicePatterns.validation.idRequired');
        }

        try {
            const deleted = await sequelize.transaction(async (t) => {
                const pattern = await ServicePatternModel.findOne({
                    where: { servicePatternId },
                    transaction: t,
                });

                if (!pattern) {
                    return false;
                }
                
                // delete all scheduled trips with this schedule

                const schedules = await ScheduleModel.findAll({
                    where: { servicePatternId },
                    attributes: ['scheduleId'],
                    transaction: t,
                });

                const scheduleIds = schedules.map((s) => s.scheduleId).filter(Boolean);
                if (scheduleIds.length > 0) {
                    await ScheduledTripsModel.destroy({
                        where: { scheduleId: scheduleIds },
                        transaction: t,
                    });
                }

                await ScheduleModel.destroy({
                    where: { servicePatternId },
                    transaction: t,
                });


                // delete all operating hours with this service pattern
                await OperatingHoursModel.destroy({
                    where: { servicePatternId },
                    transaction: t,
                });

                await ServicePatternModel.destroy({
                    where: { servicePatternId },
                    transaction: t,
                });

                return true;
            });

            //--------------------------------------------------------------------
            if (!deleted) {
                return sendResponse(res, 500, 'servicePatterns.errors.notFound');
            }

            //====================================================================

            return sendResponse(res, 200, 'servicePatterns.success.deleted');
        } catch (error) {
            console.error('Error occured while deleting service pattern.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }
    //============================================================================================================================
    //============================================================================================================================
}

