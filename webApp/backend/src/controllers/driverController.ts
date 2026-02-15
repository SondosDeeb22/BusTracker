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
    //? function to allow driver to updates his profile data (currently only phone number  is changeable)
    // =================================================================================================================================
    async updateDriverData(req:Request, res:Response){
        try {
            const user = (req as any)?.user;
            const userId = typeof user?.id === 'string' ? user.id.trim() : '';
            const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : '';

            const result = await driverService.updateDriver({
                id: userId,
                phone,
            });
            sendResponse(res, 200, result.messageKey);
            return;

        // -----------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }


    // =================================================================================================================================
    //? Fetch Driver Profile
    // =================================================================================================================================
    async fetchDriverProfile(req:Request, res:Response){
        try {
            const user = (req as any)?.user;
            const userId = typeof user?.id === 'string' ? user.id.trim() : '';

            const result = await driverService.fetchDriverProfile(userId);
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;

        // -----------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }


    // =================================================================================================================================
    //? Fetch All Drivers or specific driver
    // =================================================================================================================================
    async fetchAllDrivers(req:Request, res:Response){
        try {
            const driverIdFromQuery = typeof req.query?.driverId === 'string' ? req.query.driverId.trim() : '';
            const result = await driverService.fetchAllDrivers(driverIdFromQuery);
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;
        // -----------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    //? Fetch Driver's Schedule
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
    

    // =================================================================================================================================
    //? Buttons Control unit (controls when buttons must be viewd on driver application homepage)
    // =================================================================================================================================

    async buttonsControlUnit(req:Request, res:Response){
        try {
            const user = (req as any)?.user;
            
            const driverIdFromQuery = typeof req.query?.driverId === 'string' ? req.query.driverId.trim() : '';
            const requesterRole = typeof user?.role === 'string' ? String(user.role).trim() : '';

            
            const driverId = requesterRole === 'driver' && driverIdFromQuery ? driverIdFromQuery : user?.id;

            const result = await driverService.buttonsControlUnit(driverId);
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;

        // -----------------
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }
}