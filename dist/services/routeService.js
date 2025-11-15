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
const userHelper_1 = require("../helpers/userHelper");
const messageTemplate_1 = require("../exceptions/messageTemplate");
const helper = new userHelper_1.UserHelper();
//===================================================================================================
class RouteService {
    //===================================================================================================
    //? function to Add Route
    //===================================================================================================
    async addRoute(req, res) {
        await helper.add(req, res, routeModel_1.default, req.body, {
            //-----------------------------------------------------------
            transform: async (data) => {
                const out = { ...data };
                if (out.title) {
                    out.title = out.title.toLowerCase().trim();
                }
                return out;
            },
            //-----------------------------------------------------------
            nonDuplicateFields: ['title'],
            //-----------------------------------------------------------
            enumFields: [
                { field: "status", enumObj: routeEnum_1.status },
            ],
        });
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
        await helper.update(req, res, routeModel_1.default, req.body, {
            enumFields: [{ field: "status", enumObj: routeEnum_1.status },],
            //---------------------------------------------
            successMessage: 'Route was updated',
        });
    }
    //===================================================================================================
    //? function to view All routes for operating buses or only Operating(working) routes 
    //===================================================================================================
    async viewRoutes(req, res, displayAll) {
        try {
            let routes = [];
            if (displayAll) {
                routes = await routeModel_1.default.findAll({
                    where: {
                        status: routeEnum_1.status.covered
                    },
                    attributes: ['title']
                });
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
                    let route = await routeModel_1.default.findOne({
                        where: {
                            id: routeId[i]?.assignedRoute
                        },
                        attributes: ['title']
                    });
                    routes.push(route);
                }
            }
            (0, messageTemplate_1.sendResponse)(res, 200, null, routes);
            //===============================================
        }
        catch (error) {
            (0, messageTemplate_1.sendResponse)(res, 500, `Error occured while viewing routes ${error}`);
        }
    }
}
exports.RouteService = RouteService;
//# sourceMappingURL=routeService.js.map