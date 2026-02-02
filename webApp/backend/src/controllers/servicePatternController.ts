//======================================================================================================================
//? Importing
//======================================================================================================================
import { Request, Response } from 'express';

import { ServicePatternService } from '../services/servicePatternService';

import { sendResponse } from '../exceptions/messageTemplate';
import { handleControllerError } from './controllerErrorMapper';

//======================================================================================================================
//? Setup
//======================================================================================================================

const servicePatternService = new ServicePatternService();

//======================================================================================================================
//? Controller
//======================================================================================================================

export class ServicePatternController {

    //==================================================================================================================
    //? Get service patterns with operating hours
    //==================================================================================================================
    async getServicePatterns(req: Request, res: Response) {
        try {
            const result = await servicePatternService.getServicePatterns();
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    //==================================================================================================================
    //? Add service pattern with operating hours
    //==================================================================================================================
    async addServicePattern(req: Request, res: Response) {
        try {
            const result = await servicePatternService.addServicePattern(req.body);
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    //==================================================================================================================
    //? Update service pattern with operating hours
    //==================================================================================================================
    async updateServicePattern(req: Request, res: Response) {
        try {
            const result = await servicePatternService.updateServicePattern(req.body);
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    //==================================================================================================================
    //? Delete service pattern with operating hours
    //==================================================================================================================

    async deleteServicePattern(req: Request, res: Response) {
        try {
            const servicePatternIdRaw = req.body?.servicePatternId ?? req.body?.id ?? req.query?.servicePatternId;
            const result = await servicePatternService.deleteServicePattern(servicePatternIdRaw);
            sendResponse(res, 200, result.messageKey);
            return;
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }
}
