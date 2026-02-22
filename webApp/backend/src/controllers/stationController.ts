//============================================================================================================================================================
//?importing 
//============================================================================================================================================================
import { Request, Response } from 'express';
import { StationService } from '../services/stationService';

const stationService = new StationService();

import { sendResponse } from '../exceptions/messageTemplate';
import { handleControllerError } from './controllerErrorMapper';


//============================================================================================================================================================

export class StationController{

    // =================================================================================================================================
    //? Add
    // =================================================================================================================================
    async addStation(req:Request, res:Response){
        try {
            const result = await stationService.addStation(req.body);
            sendResponse(res, 200, result.messageKey);
            return;
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    //? Remove
    // =================================================================================================================================
    async removeStation(req:Request, res:Response){
        try {
            const result = await stationService.removeStation(req.body?.id);
            sendResponse(res, 200, result.messageKey);
            return;
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    //? Update
    // =================================================================================================================================
    async updateStation(req:Request, res:Response){
        try {
            const result = await stationService.updateStation(req.body);
            sendResponse(res, 200, result.messageKey);
            return;
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

    // =================================================================================================================================
    //? Fetch All Stations
    // =================================================================================================================================
    async fetchAllStations(req:Request, res:Response){
        try {
            const result = await stationService.fetchAllStations();
            sendResponse(res, 200, result.messageKey, result.data as any);
            return;
        } catch (error) {
            handleControllerError(res, error);
            return;
        }
    }

	// =================================================================================================================================
	//? Fetch Stations For Route Picker (exclude fixed/default stations)
	// =================================================================================================================================
	async fetchStationsForPicker(req:Request, res:Response){
		try {
			const result = await stationService.fetchStationsForPicker();
			sendResponse(res, 200, result.messageKey, result.data as any);
			return;
		} catch (error) {
			handleControllerError(res, error);
			return;
		}
	}

}
