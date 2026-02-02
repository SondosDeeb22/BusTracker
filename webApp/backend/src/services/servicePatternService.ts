//======================================================================================================================
//? Importing
//======================================================================================================================
import ServicePatternModel from '../models/servicePatternModel';
import OperatingHoursModel from '../models/operatingHoursModel';
import ScheduleModel from '../models/scheduleModel';
import ScheduledTripsModel from '../models/scheduledTripsModel';
import { sequelize } from '../config/database';

import { NotFoundError, ValidationError } from '../errors';
import { InternalError } from '../errors/InternalError';

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
    async getServicePatterns(): Promise<{ messageKey: string; data: ServicePatternDto[] }> {
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

            return { messageKey: 'common.crud.fetched', data };
        } catch (error) {
            console.error('Error occured while fetching service patterns.', error);
            throw new InternalError('common.errors.internal');
        }
    }

    //==================================================================================================================
    //? Add service pattern with operating hours
    //==================================================================================================================
    async addServicePattern(payload: Record<string, any>): Promise<{ messageKey: string; data: ServicePatternDto }> {
        const titleRaw = payload?.title;
        const selectedHoursRaw = payload?.hours;

        const title = typeof titleRaw === 'string' ? titleRaw.trim() : '';
        const hoursArray: unknown[] = Array.isArray(selectedHoursRaw) ? selectedHoursRaw : [];

        if (!title) {
            throw new ValidationError('servicePatterns.validation.titleRequired');
        }

        if (hoursArray.length === 0) {
            throw new ValidationError('servicePatterns.validation.selectAtLeastOneHour');
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
            throw new ValidationError('servicePatterns.validation.invalidHours');
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

            return { messageKey: 'servicePatterns.success.added', data: created };
        } catch (error) {
            console.error('Error occured while creating service pattern.', error);
            throw new InternalError('common.errors.internal');
        }
    }

    //==================================================================================================================
    //? Update service pattern (title + operating hours)
    //==================================================================================================================
    async updateServicePattern(payload: Record<string, any>): Promise<{ messageKey: string; data: ServicePatternDto }> {
        const servicePatternIdRaw = payload?.servicePatternId;
        const titleRaw = payload?.title;
        const selectedHoursRaw = payload?.hours;

        const servicePatternId = typeof servicePatternIdRaw === 'string' ? servicePatternIdRaw.trim() : '';
        const title = typeof titleRaw === 'string' ? titleRaw.trim() : '';
        const hoursArray: unknown[] = Array.isArray(selectedHoursRaw) ? selectedHoursRaw : [];

        if (!servicePatternId) {
            throw new ValidationError('servicePatterns.validation.idRequired');
        }

        if (!title) {
            throw new ValidationError('servicePatterns.validation.titleRequired');
        }

        if (hoursArray.length === 0) {
            throw new ValidationError('servicePatterns.validation.selectAtLeastOneHour');
        }

        const hours = Array.from(
            new Set(
                hoursArray
                    .map((h) => (typeof h === 'number' ? h : Number(h)))
                    .filter((h) => Number.isFinite(h) && h >= startOperatingHour && h <= 23)
            )
        ).sort((a, b) => a - b);

        if (hours.length === 0) {
            throw new ValidationError('servicePatterns.validation.invalidHours');
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
                throw new NotFoundError('servicePatterns.errors.notFound');
            }

            return { messageKey: 'servicePatterns.success.updated', data: updated };
        } catch (error) {
            console.error('Error occured while updating service pattern.', error);
            throw error;
        }
    }

    //==================================================================================================================
    //? Delete service pattern with operating hours
    //==================================================================================================================


    async deleteServicePattern(servicePatternIdRaw: unknown): Promise<{ messageKey: string }> {
        const servicePatternId = typeof servicePatternIdRaw === 'string' ? servicePatternIdRaw.trim() : '';

        if (!servicePatternId) {
            throw new ValidationError('servicePatterns.validation.idRequired');
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

            if (!deleted) {
                throw new NotFoundError('servicePatterns.errors.notFound');
            }

            return { messageKey: 'servicePatterns.success.deleted' };
        } catch (error) {
            console.error('Error occured while deleting service pattern.', error);
            throw new InternalError('common.errors.internal');
        }
    }
    //============================================================================================================================
    //============================================================================================================================
}

