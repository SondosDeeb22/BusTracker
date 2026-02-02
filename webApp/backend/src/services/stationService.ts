//===================================================================================================
//? Importing
//===================================================================================================

import {Request, Response } from 'express';
//import models
import stationModel from "../models/stationModel";

//import Enums
import {status } from '../enums/stationEnum';

import { ConflictError, NotFoundError, ValidationError } from '../errors';

// import helpers
import { UserHelper } from "../helpers/userHelper";
const helper = new UserHelper();

import { sendResponse } from '../exceptions/messageTemplate';



//===================================================================================================



export class StationService{  

    //===================================================================================================
    //? function to Add Station
    //===================================================================================================

    async addStation(req: Request, res: Response){
        try{
            await helper.add(stationModel, req.body, {

                nonDuplicateFields: ['stationName'],
                //----------------------------------------------------------------
                transform: async(data) => {
                    const out = {...data};

                    if(out.stationName){
                        out.stationName = data.stationName.toLowerCase().trim();
                    }

                    return out;
                    
                },
                //----------------------------------------------------------------
                enumFields: [
                    { field: "status", enumObj: status },
                ],            
              }
            );

            return sendResponse(res, 200, "stations.success.added");
        
        }catch(error){
            console.error('Error occured while creating station.', error);

            if (error instanceof ValidationError) {
                if (error.message === 'fillAllFields') return sendResponse(res, 400, 'common.errors.validation.fillAllFields');
                if (error.message === 'invalidField') return sendResponse(res, 400, 'common.errors.validation.invalidField');
                if (error.message === 'required') return sendResponse(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData') return sendResponse(res, 400, 'common.errors.validation.noData');
                return sendResponse(res, 400, 'common.errors.validation.invalidField');
            }

            if (error instanceof NotFoundError) {
                return sendResponse(res, 404, 'common.crud.notFound');
            }

            if (error instanceof ConflictError) {
                return sendResponse(res, 409, error.message);
            }

            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return sendResponse(res, 500, error.message);
                }
            }

            return sendResponse(res, 500, 'common.errors.internal');
        }
        
    }

    //===================================================================================================
    //? function to Remove Station
    //===================================================================================================
    async removeStation(req: Request, res: Response){
        try {
            await helper.remove(stationModel, 'id', req.body.id);
            return sendResponse(res, 200, 'common.crud.removed');
        
        //==============================================
        } catch (error) {
            console.error('Error occured while removing station.', error);

            if (error instanceof ValidationError) {
                if (error.message === 'required') return sendResponse(res, 400, 'common.errors.validation.required');
                return sendResponse(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof NotFoundError) {
                return sendResponse(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return sendResponse(res, 500, error.message);
                }
            }

            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

    //===================================================================================================
    //? function to Update station
    //===================================================================================================
    async updateStation(req: Request, res: Response){
        try {
            const result = await helper.update(stationModel, req.body, {
                enumFields: [{ field: "status", enumObj: status }]
            });
            return sendResponse(res, 200, result.updated ? 'common.crud.updated' : 'common.crud.noChanges');
        
        //==============================================
        } catch (error) {
            console.error('Error occured while updating station.', error);

            if (error instanceof ValidationError) {
                if (error.message === 'required') return sendResponse(res, 400, 'common.errors.validation.required');
                if (error.message === 'noData') return sendResponse(res, 400, 'common.errors.validation.noData');
                if (error.message === 'invalidField') return sendResponse(res, 400, 'common.errors.validation.invalidField');
                return sendResponse(res, 400, 'common.errors.validation.invalidField');
            }
            if (error instanceof NotFoundError) {
                return sendResponse(res, 404, 'common.crud.notFound');
            }
            if (error instanceof Error) {
                if (error.message.startsWith('common.')) {
                    return sendResponse(res, 500, error.message);
                }
            }

            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

    //===================================================================================================
    //? function to Fetch All Stations
    //===================================================================================================

    async fetchAllStations(req: Request, res: Response){
        try {
            const stations = await stationModel.findAll({
                attributes: ['id', 'stationName', 'status', 'latitude', 'longitude']
            });

            return sendResponse(res, 200, 'stations.success.fetched', stations);
        } catch (error) {
            console.error('Error occured while fetching stations.', error);
            return sendResponse(res, 500, 'common.errors.internal');
        }
    }

}
