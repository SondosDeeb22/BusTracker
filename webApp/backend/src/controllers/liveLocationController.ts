//============================================================================================================================================================
//?importing 
//============================================================================================================================================================

import { Request, Response } from 'express';

import { LiveLocationService } from '../services/liveLocationService';
const liveLocationService = new LiveLocationService();

import { sendResponse } from '../exceptions/messageTemplate';
import { handleControllerError } from './controllerErrorMapper';

//============================================================================================================================================================

export class LiveLocationController{

    // =================================================================================================================================
    //? Update live location (create if not exists)
    // =================================================================================================================================
    async updateLiveLocation(req:Request, res:Response){
        try {
            const result = await liveLocationService.updateLiveLocation(req.body);
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;

        // -------------------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }
}
