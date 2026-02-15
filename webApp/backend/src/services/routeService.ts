//===================================================================================================
//? Importing
//===================================================================================================

//import Enums
import {status } from '../enums/routeEnum';
import {status as busStatus } from '../enums/busEnum';

//import models
import RouteModel from "../models/routeModel";
import BusModel from "../models/busModel";
import RouteStationModel from "../models/routeStationModel";
import stationModel from "../models/stationModel";

import { ConflictError, NotFoundError, ValidationError, InternalError  } from '../errors';

import { UserHelper } from "../helpers/userHelper";
const helper = new UserHelper();

import { normalizeColorToArgbInt } from '../helpers/colorHelper';



//===================================================================================================



export class RouteService{  

    //===================================================================================================
    //? function to Add Route
    //===================================================================================================

    async addRoute(payload: Record<string, any>): Promise<{ messageKey: string }> {

        const body = payload || {};
        const stations: string[] = Array.isArray(body.stations) ? body.stations : [];

        const finalPayload: Record<string, any> = {
            ...body,
            totalStops: stations.length
        };

        try {
            await helper.add(RouteModel, finalPayload,
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
            if(stations.length > 0 && finalPayload.title){
                const createdRoute = await RouteModel.findOne({
                    where: { title: String(finalPayload.title).toLowerCase().trim() },
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

            return { messageKey: 'routes.success.added' };

        } catch (error) {
            console.error('Error occured while creating route.', error);
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
    //? function to Remove Route
    //===================================================================================================
    async removeRoute(routeId: unknown): Promise<{ messageKey: string }> {
        try {
            await helper.remove(RouteModel, 'id', String(routeId));
            return { messageKey: 'common.crud.removed' };
        
        // ---------------------------------------
        } catch (error) {
            console.error('Error occured while removing route.', error);
            throw error;
        }
    }

    //===================================================================================================
    //? function to Update Route
    //===================================================================================================
    async updateRoute(payload: Record<string, any>): Promise<{ messageKey: string }> {
        try {
            const body = payload || {};
            const { id, title, color, status: routeStatusValue } = body;
            const stations: string[] = Array.isArray(body.stations) ? body.stations : [];

            if(!id){
                throw new ValidationError('routes.validation.idRequired');
            }

            // validate status (if provided)
            if(routeStatusValue && !Object.values(status).includes(routeStatusValue)){
                throw new ValidationError('common.errors.validation.invalidField');
            }

            const routeExists = await RouteModel.findOne({
                where: { id },
                attributes: ['id']
            });

            if(!routeExists){
                throw new NotFoundError('common.errors.notFound');
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
                throw new ConflictError('common.crud.notUpdated');
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

            return { messageKey: 'routes.success.updated' };

        // ---------------------------------------
        } catch (error) {
            console.error('Error occured while updating route.', error);
            throw error;
        }
    }


    
    //===================================================================================================
    //? function to view All routes for operating buses    or     only Operating(working) routes 
    //===================================================================================================
    async viewRoutes(displayAll: boolean): Promise<{ messageKey: string; data: unknown }> {
        try{

            let routes: any[] = [];

            if(displayAll){
                routes = await RouteModel.findAll({
                    attributes: ['id', 'title', 'color', 'totalStops', 'status']
                });

                for (const route of routes) {
                    (route as any).dataValues.colorInt = normalizeColorToArgbInt((route as any)?.color);
                }
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
                const routeId = await BusModel.findAll({
                    where: {
                        status: busStatus.operating
                    },
                    attributes: ['id', 'assignedRoute']
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
                        (route as any).dataValues.colorInt = normalizeColorToArgbInt((route as any)?.color);
                        
                        // add the busId to the route
                        (route as any).dataValues.busId = routeId[i]?.id;
                        routes.push(route);
                    }
                }
            }

            return { messageKey: 'common.crud.fetched', data: routes };

        // ---------------------------------------
        }catch(error){
            console.error('Error occured while viewing routes.', error);
            throw new InternalError('common.errors.internal');
        }
    }

}

