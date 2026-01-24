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
import RouteStationModel from "../models/routeStationModel";
import stationModel from "../models/stationModel";

import { UserHelper } from "../helpers/userHelper";
import { sendResponse } from '../exceptions/messageTemplate';
const helper = new UserHelper();



//===================================================================================================



export class RouteService{  

    //===================================================================================================
    //? function to Add Route
    //===================================================================================================

    async addRoute(req: Request, res: Response){
        try{
            const body = req.body || {};
            const stations: string[] = Array.isArray(body.stations) ? body.stations : [];

            const payload = {
                ...body,
                totalStops: stations.length
            };

            await helper.add(req, res, RouteModel, payload,
                {
                    //-----------------------------------------------------------
                    transform: async (data) => {
                        const out = {...data};
                        if(out.title){
                            out.title  = out.title.toLowerCase().trim();
                        }
                        // remove non-column field
                        delete out.stations;
                        return out;
                    },
                    //-----------------------------------------------------------
                    nonDuplicateFields: ['title'],
                    //-----------------------------------------------------------
                    enumFields: [
                        { field: "status", enumObj: status },
                    ],
                    //-----------------------------------------------------------
                }
            );

            // attach stations to route_stations table if provided
            if(stations.length > 0){
                const createdRoute = await RouteModel.findOne({
                    where: { title: payload.title.toLowerCase().trim() },
                    attributes: ['id']
                });

                if(createdRoute){
                    const rows = stations.map((stationId, idx) => ({
                        routeId: createdRoute.id,
                        stationId,
                        orderIndex: idx
                    }));
                    await RouteStationModel.bulkCreate(rows);
                }
            }

            sendResponse(res, 200, 'routes.success.added');
        
        }catch(error){
            console.error('Error occured while creating route.', error);
            sendResponse(res, 500, 'common.errors.internal');
        }
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
        try{
            const body = req.body || {};
            const { id, title, color, status: routeStatusValue } = body;
            const stations: string[] = Array.isArray(body.stations) ? body.stations : [];

            if(!id){
                sendResponse(res, 500, 'routes.validation.idRequired');
                return;
            }

            // validate status (if provided)
            if(routeStatusValue && !Object.values(status).includes(routeStatusValue)){
                sendResponse(res, 500, 'common.validation.invalidField');
                return;
            }

            // normalize title
            const normalizedTitle = title ? String(title).toLowerCase().trim() : undefined;

            // build updates
            const updates: Record<string, any> = {};
            if(normalizedTitle !== undefined) updates.title = normalizedTitle;
            if(color !== undefined) updates.color = color;
            if(routeStatusValue !== undefined) updates.status = routeStatusValue;
            updates.totalStops = stations.length;

            const [updatedCount] = await RouteModel.update(updates, {
                where: { id }
            });

            if(updatedCount === 0){
                sendResponse(res, 500, 'common.crud.notUpdated');
                return;
            }

            // replace stations list
            await RouteStationModel.destroy({
                where: { routeId: id }
            });

            if(stations.length > 0){
                const rows = stations.map((stationId, idx) => ({
                    routeId: id,
                    stationId,
                    orderIndex: idx
                }));
                await RouteStationModel.bulkCreate(rows);
            }

            sendResponse(res, 200, 'routes.success.updated');
        }catch(error){
            console.error('Error occured while updating route.', error);
            sendResponse(res, 500, 'common.errors.internal');
        }
    }


    
    //===================================================================================================
    //? function to view All routes for operating buses or only Operating(working) routes 
    //===================================================================================================
    async viewRoutes(req: Request, res: Response, displayAll: boolean){
        try{
            let routes = [];

            if(displayAll){
                routes = await RouteModel.findAll({
                    attributes: ['id', 'title', 'color', 'totalStops', 'status']
                });
                // attach stations per route
                for (const route of routes) {
                    const routeStations = await RouteStationModel.findAll({
                        where: { routeId: route.id },
                        attributes: ['stationId', 'orderIndex'],
                        order: [['orderIndex', 'ASC']]
                    });

                    const stationIds: string[] = routeStations.map((rs: any) => rs.stationId);
                    let stations: { id: string; stationName: string }[] = [];
                    if (stationIds.length > 0) {
                        const stationRows = await stationModel.findAll({
                            where: { id: stationIds },
                            attributes: ['id', 'stationName']
                        });
                        const stationMap = new Map(stationRows.map((st: any) => [st.id, st.stationName]));
                        stations = routeStations.map((rs: any) => ({
                            id: rs.stationId,
                            stationName: stationMap.get(rs.stationId) || ''
                        }));
                    }

                    (route as any).dataValues.stations = stations;
                }
                
            }else{
                let routeId;
                routeId = await BusModel.findAll({
                    where: {
                        status: busStatus.operating
                    },
                    attributes: ['assignedRoute']
                })

                for(let i = 0; i< routeId.length; i++){
                    const assignedRouteId = routeId[i]?.assignedRoute;
                    if (!assignedRouteId) {
                        continue;
                    }
                    let route = await RouteModel.findOne({
                        where: {
                            id: assignedRouteId
                        },
                        attributes: ['id', 'title', 'color', 'totalStops', 'status']
                    });
                    if(route) {
                        routes.push(route);
                    }
                }
            }

            sendResponse(res, 200, null, routes);


        //===============================================
        }catch(error){
            console.error('Error occured while viewing routes.', error);
            sendResponse(res, 500, 'common.errors.internal');

        }
    }

}

