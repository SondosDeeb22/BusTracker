//============================================================================================================================================================
//?importing 
//============================================================================================================================================================
import { Request, Response } from 'express';
import { RouteService } from '../services/routeService';
import { sendResponse } from '../exceptions/messageTemplate';
import { handleControllerError } from './controllerErrorMapper';

const routeService = new RouteService();


//============================================================================================================================================================

export class RouteController{

    // =================================================================================================================================
    // Add
    async addRoute(req:Request, res:Response){
        try {
            const result = await routeService.addRoute(req.body);
            sendResponse(res, 200, result.messageKey);
            return;
       
        // ---------------------------------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    // Remove
    async removeRoute(req:Request, res:Response){
        try {
            const result = await routeService.removeRoute(req.body?.id);
            sendResponse(res, 200, result.messageKey);
            return;

        // ---------------------------------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    //? Update
    // =================================================================================================================================
    async updateRoute(req:Request, res:Response){
        try {
            const result = await routeService.updateRoute(req.body);
            sendResponse(res, 200, result.messageKey);
            return;

        // ---------------------------------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    
    // =================================================================================================================================
    //? View All Routes buses are covering
    // =================================================================================================================================
    async viewAllRoutes(req:Request, res:Response){
        try {
            const result = await routeService.viewRoutes(true);
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;

        // ---------------------------------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    //? View Routes of the operating buese
    // =================================================================================================================================
    async viewOperatingRoutes(req:Request, res:Response){
        try {
            const result = await routeService.viewRoutes(false);
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;

        // ---------------------------------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }
}