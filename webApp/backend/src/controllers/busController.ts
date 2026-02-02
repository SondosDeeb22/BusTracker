//============================================================================================================================================================
//?importing 
//============================================================================================================================================================
import { Request, Response } from 'express';
import { BusService } from '../services/busService';

const busService = new BusService();

import { sendResponse } from '../exceptions/messageTemplate';
import { handleControllerError } from './controllerErrorMapper';

//============================================================================================================================================================



export class BusController{

    // =================================================================================================================================
    //? Add Bus
    // =================================================================================================================================

    async addBus(req:Request, res:Response){
        try {
            const result = await busService.addBus(req.body);
            sendResponse(res, 200, result.messageKey);
            return;

        // --------------------------------------
        }catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    //? Remove
    // =================================================================================================================================
    async removeBus(req:Request, res:Response){
        try {
            const result = await busService.removeBus(req.body?.id);
            sendResponse(res, 200, result.messageKey);
            return;

        // --------------------------------------------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    //? Update
    // =================================================================================================================================
    async updateBus(req:Request, res:Response){
        try {
            const result = await busService.updateBus(req.body);
            sendResponse(res, 200, result.messageKey);
            return;
        
        // ------------------------------------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    //? Fetch All Buses
    // =================================================================================================================================
    async fetchAllBuses(req:Request, res:Response){
        try {
            const result = await busService.fetchAllBuses();
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;

        // ------------------------------------------------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

}