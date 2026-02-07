//============================================================================================================================================================
//?importing 
//============================================================================================================================================================
import { Request, Response } from 'express';
import { DriverService } from '../services/driverService';

const driverService = new DriverService();

import { sendResponse } from '../exceptions/messageTemplate';
import { handleControllerError } from './controllerErrorMapper';


//============================================================================================================================================================

export class DriverController{

    // =================================================================================================================================
    // Add
    async addDriver(req:Request, res:Response){
        try {
            const result = await driverService.addDriver(req.body);
            sendResponse(res, 200, result.messageKey);
            return;

        // -------------------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    // Remove
    async removeDriver(req:Request, res:Response){
        try {
            const result = await driverService.removeDriver(req.body?.id);
            sendResponse(res, 200, result.messageKey);
            return;

        // -------------------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    //? Update
    // =================================================================================================================================
    async updateDriver(req:Request, res:Response){
        try {
            const result = await driverService.updateDriver(req.body);
            sendResponse(res, 200, result.messageKey);
            return;

        // -----------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    //? Fetch All Drivers
    // =================================================================================================================================
    async fetchAllDrivers(req:Request, res:Response){
        try {
            const result = await driverService.fetchAllDrivers();
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;
        // -----------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    //? Fetch Driver Schedule
    // =================================================================================================================================
    async fetchDriverSchedule(req:Request, res:Response){
        try {
            const user = (req as any)?.user;
            console.log(user);
            console.log(user.id);
            console.log(user.role);

            const driverIdFromQuery = typeof req.query?.driverId === 'string' ? req.query.driverId.trim() : '';
            const requesterRole = typeof user?.role === 'string' ? String(user.role).trim() : '';

            
            const driverId = requesterRole === 'admin' && driverIdFromQuery ? driverIdFromQuery : user?.id;

            const result = await driverService.fetchDriverSchedule(driverId);
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;

        // -----------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }
    
}