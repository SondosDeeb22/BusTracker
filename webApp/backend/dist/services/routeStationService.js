"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteStationService = void 0;
//===================================================================================================
//? Importing
//===================================================================================================
const routeStationModel_1 = __importDefault(require("../models/routeStationModel"));
//===================================================================================================
//? Service
//===================================================================================================
class RouteStationService {
    //===================================================================================================
    //? Generate Route Station Id
    //===================================================================================================
    async generateNextRouteStationId() {
        const last = await routeStationModel_1.default.findOne({
            attributes: ["routeStationId"],
            order: [["routeStationId", "DESC"]],
        });
        const lastId = typeof last?.routeStationId === "string" ? String(last.routeStationId).trim() : "";
        const lastN = /^RS(\d{4})$/.test(lastId) ? Number(lastId.slice(2)) : 0;
        for (let n = Math.max(1, lastN + 1); n <= 9999; n++) {
            const candidate = `RS${String(n).padStart(4, "0")}`;
            const exists = await routeStationModel_1.default.findOne({
                where: { routeStationId: candidate },
                attributes: ["routeStationId"],
            });
            if (!exists)
                return candidate;
        }
        throw new Error("routeStationId space exhausted");
    }
    //===================================================================================================
    //? Create Route Station
    //===================================================================================================
    async createOne(input) {
        const routeStationId = await this.generateNextRouteStationId();
        await routeStationModel_1.default.create({
            routeStationId,
            routeId: input.routeId,
            stationId: input.stationId,
            orderIndex: input.orderIndex,
        });
    }
    //===================================================================================================
    //? Create Many Route Stations
    //===================================================================================================
    async createMany(inputs) {
        for (const row of inputs) {
            await this.createOne(row);
        }
    }
}
exports.RouteStationService = RouteStationService;
//# sourceMappingURL=routeStationService.js.map