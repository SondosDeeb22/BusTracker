//===================================================================================================
//? Importing
//===================================================================================================

import {Request, Response } from 'express';
//import models
import stationModel from "../models/stationModel";

//import Enums
import {status } from '../enums/stationEnum';

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
            await helper.add(req, res, stationModel, req.body, {

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

            sendResponse(res, 200, "station was Added successfully");
        
        }catch(error){
            sendResponse(res, 500, `Error Found while creating station. ${error}`);
        }
        
    }

    //===================================================================================================
    //? function to Remove Station
    //===================================================================================================
    async removeStation(req: Request, res: Response){
        await helper.remove(req, res, stationModel, 'id', req.body.id);
    }

    //===================================================================================================
    //? function to Update station
    //===================================================================================================
    async updateStation(req: Request, res: Response){
        await helper.update(req, res, stationModel, req.body, 
            {
                enumFields: [{ field: "status", enumObj: status }, ]
            }
        );
    }

    //===================================================================================================
    //? function to Fetch All Stations
    //===================================================================================================

    async fetchAllStations(req: Request, res: Response){
        try {
            const stations = await stationModel.findAll({
                attributes: ['id', 'stationName', 'status', 'latitude', 'longitude']
            });

            res.status(200).json({
                success: true,
                message: 'Stations fetched successfully',
                data: stations
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching stations',
                error: error
            });
        }
    }

}
