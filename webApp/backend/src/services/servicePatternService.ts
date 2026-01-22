//======================================================================================================================
//? Importing
//======================================================================================================================
import { Request, Response } from 'express';

import { sendResponse } from '../exceptions/messageTemplate';

import ServicePatternModel from '../models/servicePatternModel';
import OperatingHoursModel from '../models/operatingHoursModel';

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
            return sendResponse(res, 500, `Error occured while fetching service patterns ${error}`);
        }
    }
}
