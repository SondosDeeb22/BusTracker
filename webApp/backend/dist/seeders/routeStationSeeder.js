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
        await queryInterface.bulkDelete("route_stations", {});
        console.log("route stations successfully removed!");
    },
};
//# sourceMappingURL=routeStationSeeder.js.map