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
const userHelper_1 = require("../helpers/userHelper");
const messageTemplate_1 = require("../exceptions/messageTemplate");
const helper = new userHelper_1.UserHelper();
//===================================================================================================
class RouteService {
    //===================================================================================================
    //? function to Add Route
    //===================================================================================================
    async addRoute(req, res) {
        try {
            const body = req.body || {};
            const stations = Array.isArray(body.stations) ? body.stations : [];
            const payload = {
                ...body,
                totalStops: stations.length
            };
            await helper.add(req, res, routeModel_1.default, payload, {
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
            if (stations.length > 0) {
                const createdRoute = await routeModel_1.default.findOne({
                    where: { title: payload.title.toLowerCase().trim() },
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
            (0, messageTemplate_1.sendResponse)(res, 200, 'routes.success.added');
        }
        catch (error) {
            console.error('Error occured while creating route.', error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? function to Remove Route
    //===================================================================================================
    async removeRoute(req, res) {
        await helper.remove(req, res, routeModel_1.default, 'id', req.body.id);
    }
    //===================================================================================================
    //? function to Update Route
    //===================================================================================================
    async updateRoute(req, res) {
        try {
            const body = req.body || {};
            const { id, title, color, status: routeStatusValue } = body;
            const stations = Array.isArray(body.stations) ? body.stations : [];
            if (!id) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'routes.validation.idRequired');
                return;
            }
            // validate status (if provided)
            if (routeStatusValue && !Object.values(routeEnum_1.status).includes(routeStatusValue)) {
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.validation.invalidField');
                return;
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
                (0, messageTemplate_1.sendResponse)(res, 500, 'common.crud.notUpdated');
                return;
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
            (0, messageTemplate_1.sendResponse)(res, 200, 'routes.success.updated');
        }
        catch (error) {
            console.error('Error occured while updating route.', error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
    //===================================================================================================
    //? function to view All routes for operating buses or only Operating(working) routes 
    //===================================================================================================
    async viewRoutes(req, res, displayAll) {
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
                let routeId;
                routeId = await busModel_1.default.findAll({
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
            (0, messageTemplate_1.sendResponse)(res, 200, null, routes);
            //===============================================
        }
        catch (error) {
            console.error('Error occured while viewing routes.', error);
            (0, messageTemplate_1.sendResponse)(res, 500, 'common.errors.internal');
        }
    }
}
exports.RouteService = RouteService;
//# sourceMappingURL=routeService.js.map