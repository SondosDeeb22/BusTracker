"use strict";
// ====================================================================================================================================
//? Import
// ====================================================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sampleRouteStation_1 = __importDefault(require("./sampleRouteStation"));
//====================================================================================================================================
exports.default = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("route_stations", sampleRouteStation_1.default);
        console.log("route stations successfully inserted!");
    },
    //-------------------------------------------------------------------
    async down(queryInterface) {
        await queryInterface.bulkDelete("route_stations", {
            routeStationId: [
                "RS01",
                "RS02",
                "RS03",
                "RS04",
                "RS05",
                "RS06",
                "RS07",
                "RS08",
                "RS09",
                "RS10",
                "RS11",
                "RS12",
            ],
        });
        console.log("route stations successfully removed!");
    },
};
//# sourceMappingURL=routeStationSeeder.js.map