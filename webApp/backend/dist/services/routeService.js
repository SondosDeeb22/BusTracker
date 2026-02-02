"use strict";
//===================================================================================================
//? Importing
//===================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteService = void 0;
//import Enums
const routeEnum_1 = require("../enums/routeEnum");
const busEnum_1 = require("../enums/busEnum");
//import models
const routeModel_1 = __importDefault(require("../models/routeModel"));
const busModel_1 = __importDefault(require("../models/busModel"));
const routeStationModel_1 = __importDefault(require("../models/routeStationModel"));
const stationModel_1 = __importDefault(require("../models/stationModel"));
const errors_1 = require("../errors");
const userHelper_1 = require("../helpers/userHelper");
const helper = new userHelper_1.UserHelper();
//===================================================================================================
class RouteService {
    //===================================================================================================
    //? function to Add Route
    //===================================================================================================
    async addRoute(payload) {
        const body = payload || {};
        const stations = Array.isArray(body.stations) ? body.stations : [];
        const finalPayload = {
            ...body,
            totalStops: stations.length
        };
        try {
            await helper.add(routeModel_1.default, finalPayload, {
                //-----------------------------------------------------------
                transform: async (data) => {
                    const out = { ...data };
                    if (out.title) {
                        out.title = out.title.toLowerCase().trim();
                    }
                    // remove non-column field
                    delete out.stations;
                    return out;
                },
                //-----------------------------------------------------------
                nonDuplicateFields: ['title'],
                //-----------------------------------------------------------
                enumFields: [
                    { field: "status", enumObj: routeEnum_1.status },
                ],
                //-----------------------------------------------------------
            });
            // attach stations to route_stations table if provided
            if (stations.length > 0 && finalPayload.title) {
                const createdRoute = await routeModel_1.default.findOne({
                    where: { title: String(finalPayload.title).toLowerCase().trim() },
                    attributes: ['id']
                });
                if (createdRoute) {
                    const rows = stations.map((stationId, idx) => ({
                        routeId: createdRoute.id,
                        stationId,
                        orderIndex: idx
                    }));
                    await routeStationModel_1.default.bulkCreate(rows);
                }
            }
            return { messageKey: 'routes.success.added' };
        }
        catch (error) {
            console.error('Error occured while creating route.', error);
            if (error instanceof errors_1.ValidationError ||
                error instanceof errors_1.ConflictError ||
                error instanceof errors_1.NotFoundError) {
                throw error;
            }
            throw new errors_1.InternalError('common.errors.internal');
        }
    }
    //===================================================================================================
    //? function to Remove Route
    //===================================================================================================
    async removeRoute(routeId) {
        try {
            await helper.remove(routeModel_1.default, 'id', String(routeId));
            return { messageKey: 'common.crud.removed' };
            // ---------------------------------------
        }
        catch (error) {
            console.error('Error occured while removing route.', error);
            throw error;
        }
    }
    //===================================================================================================
    //? function to Update Route
    //===================================================================================================
    async updateRoute(payload) {
        try {
            const body = payload || {};
            const { id, title, color, status: routeStatusValue } = body;
            const stations = Array.isArray(body.stations) ? body.stations : [];
            if (!id) {
                throw new errors_1.ValidationError('routes.validation.idRequired');
            }
            // validate status (if provided)
            if (routeStatusValue && !Object.values(routeEnum_1.status).includes(routeStatusValue)) {
                throw new errors_1.ValidationError('common.errors.validation.invalidField');
            }
            const routeExists = await routeModel_1.default.findOne({
                where: { id },
                attributes: ['id']
            });
            if (!routeExists) {
                throw new errors_1.NotFoundError('common.errors.notFound');
            }
            // normalize title
            const normalizedTitle = title ? String(title).toLowerCase().trim() : undefined;
            // build updates
            const updates = {};
            if (normalizedTitle !== undefined)
                updates.title = normalizedTitle;
            if (color !== undefined)
                updates.color = color;
            if (routeStatusValue !== undefined)
                updates.status = routeStatusValue;
            updates.totalStops = stations.length;
            const [updatedCount] = await routeModel_1.default.update(updates, {
                where: { id }
            });
            if (updatedCount === 0) {
                throw new errors_1.ConflictError('common.crud.notUpdated');
            }
            // replace stations list
            await routeStationModel_1.default.destroy({
                where: { routeId: id }
            });
            if (stations.length > 0) {
                const rows = stations.map((stationId, idx) => ({
                    routeId: id,
                    stationId,
                    orderIndex: idx
                }));
                await routeStationModel_1.default.bulkCreate(rows);
            }
            return { messageKey: 'routes.success.updated' };
            // ---------------------------------------
        }
        catch (error) {
            console.error('Error occured while updating route.', error);
            throw error;
        }
    }
    //===================================================================================================
    //? function to view All routes for operating buses or only Operating(working) routes 
    //===================================================================================================
    async viewRoutes(displayAll) {
        try {
            let routes = [];
            if (displayAll) {
                routes = await routeModel_1.default.findAll({
                    attributes: ['id', 'title', 'color', 'totalStops', 'status']
                });
                // attach stations per route
                for (const route of routes) {
                    const routeStations = await routeStationModel_1.default.findAll({
                        where: { routeId: route.id },
                        attributes: ['stationId', 'orderIndex'],
                        order: [['orderIndex', 'ASC']]
                    });
                    const stationIds = routeStations.map((rs) => rs.stationId);
                    let stations = [];
                    if (stationIds.length > 0) {
                        const stationRows = await stationModel_1.default.findAll({
                            where: { id: stationIds },
                            attributes: ['id', 'stationName']
                        });
                        const stationMap = new Map(stationRows.map((st) => [st.id, st.stationName]));
                        stations = routeStations.map((rs) => ({
                            id: rs.stationId,
                            stationName: stationMap.get(rs.stationId) || ''
                        }));
                    }
                    route.dataValues.stations = stations;
                }
            }
            else {
                const routeId = await busModel_1.default.findAll({
                    where: {
                        status: busEnum_1.status.operating
                    },
                    attributes: ['assignedRoute']
                });
                for (let i = 0; i < routeId.length; i++) {
                    const assignedRouteId = routeId[i]?.assignedRoute;
                    if (!assignedRouteId) {
                        continue;
                    }
                    let route = await routeModel_1.default.findOne({
                        where: {
                            id: assignedRouteId
                        },
                        attributes: ['id', 'title', 'color', 'totalStops', 'status']
                    });
                    if (route) {
                        routes.push(route);
                    }
                }
            }
            return { messageKey: 'common.crud.fetched', data: routes };
            // ---------------------------------------
        }
        catch (error) {
            console.error('Error occured while viewing routes.', error);
            throw new errors_1.InternalError('common.errors.internal');
        }
    }
}
exports.RouteService = RouteService;
//# sourceMappingURL=routeService.js.map