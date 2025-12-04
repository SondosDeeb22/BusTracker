//===================================================================================================
//? Importing
//===================================================================================================

import {Request, Response } from 'express';

//import Enums
import {status } from '../enums/routeEnum';
import {status as busStatus } from '../enums/busEnum';

//import models
import RouteModel from "../models/routeModel";
import BusModel from "../models/busModel";

import { UserHelper } from "../helpers/userHelper";
import { sendResponse } from '../exceptions/messageTemplate';
const helper = new UserHelper();



//===================================================================================================



export class RouteService{  

    //===================================================================================================
    //? function to Add Route
    //===================================================================================================

    async addRoute(req: Request, res: Response){
        await helper.add(req, res, RouteModel, req.body,
        {
            //-----------------------------------------------------------
            transform: async (data) => {
                const out = {...data};
                if(out.title){
                    out.title  = out.title.toLowerCase().trim();
                }
                return out;
            },
            //-----------------------------------------------------------
            nonDuplicateFields: ['title'],
            //-----------------------------------------------------------
            enumFields: [
                { field: "status", enumObj: status },
            ],             
        }
        );
    }

    //===================================================================================================
    //? function to Remove Route
    //===================================================================================================
    async removeRoute(req: Request, res: Response){
        await helper.remove(req, res, RouteModel, 'id', req.body.id);
    }

    //===================================================================================================
    //? function to Update Route
    //===================================================================================================
    async updateRoute(req: Request, res: Response){
        await helper.update(req, res, RouteModel,  req.body, 
            {
                enumFields: [{ field: "status", enumObj: status }, ],
                //---------------------------------------------
                successMessage: 'Route was updated',
            }
        );
    }


    
    //===================================================================================================
    //? function to view All routes for operating buses or only Operating(working) routes 
    //===================================================================================================
    async viewRoutes(req: Request, res: Response, displayAll: boolean){
        try{
            let routes = [];

            if(displayAll){
                routes = await RouteModel.findAll({
                    where:{
                        status: status.covered
                    }, 
                    attributes: ['id', 'title']
                });
                
            }else{
                let routeId;
                routeId = await BusModel.findAll({
                    where: {
                        status: busStatus.operating
                    },
                    attributes: ['assignedRoute']
                })

                for(let i = 0; i< routeId.length; i++){
                    let route = await RouteModel.findOne({
                        where: {
                            id: routeId[i]?.assignedRoute
                        },
                        attributes: ['id', 'title', 'color']
                    });
                    routes.push(route);

                }
            }

            sendResponse(res, 200, null, routes);


        //===============================================
        }catch(error){
            sendResponse(res, 500, `Error occured while viewing routes ${error}`)

        }
    }

}

