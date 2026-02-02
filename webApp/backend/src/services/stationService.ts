//===================================================================================================
//? Importing
//===================================================================================================

//import models
import stationModel from "../models/stationModel";

//import Enums
import {status } from '../enums/stationEnum';

import { ConflictError, NotFoundError, ValidationError, InternalError } from '../errors';

// import helpers
import { UserHelper } from "../helpers/userHelper";
const helper = new UserHelper();



//===================================================================================================



export class StationService{  

    //===================================================================================================
    //? function to Add Station
    //===================================================================================================

    async addStation(payload: Record<string, any>): Promise<{ messageKey: string }> {
        try{
            await helper.add(stationModel, payload, {

                nonDuplicateFields: ['stationName'],
                //----------------------------------------------------------------
                transform: async(data) => {
                    const out = {...data};

                    if(out.stationName){
                        out.stationName = String(data.stationName).toLowerCase().trim();
                    }

                    return out;
                    
                },
                //----------------------------------------------------------------
                enumFields: [
                    { field: "status", enumObj: status },
                ],            
              }
            );

            return { messageKey: "stations.success.added" };
        
        }catch(error){
            console.error('Error occured while creating station.', error);

            if (
                error instanceof ValidationError ||
                error instanceof ConflictError ||
                error instanceof NotFoundError
            ) {
                throw error;
            }

            throw new InternalError('common.errors.internal');
        }
        
    }

    //===================================================================================================
    //? function to Remove Station
    //===================================================================================================
    async removeStation(stationId: unknown): Promise<{ messageKey: string }> {
        await helper.remove(stationModel, 'id', String(stationId));
        return { messageKey: 'common.crud.removed' };
    }

    //===================================================================================================
    //? function to Update station
    //===================================================================================================
    async updateStation(payload: Record<string, any>): Promise<{ updated: boolean; messageKey: string }> {
        const result = await helper.update(stationModel, payload, {
            enumFields: [{ field: "status", enumObj: status }]
        });

        return {
            updated: result.updated,
            messageKey: result.updated ? 'common.crud.updated' : 'common.crud.noChanges'
        };
    }

    //===================================================================================================
    //? function to Fetch All Stations
    //===================================================================================================

    async fetchAllStations(): Promise<{ messageKey: string; data: unknown }> {
        try {
            const stations = await stationModel.findAll({
                attributes: ['id', 'stationName', 'status', 'latitude', 'longitude']
            });

            return { messageKey: 'stations.success.fetched', data: stations };
        } catch (error) {
            console.error('Error occured while fetching stations.', error);
            throw new InternalError('common.errors.internal');
        }
    }

}
