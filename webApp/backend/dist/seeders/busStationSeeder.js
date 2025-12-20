"use strict";
// ====================================================================================================================================
//? Import
// ====================================================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sampleBusStation_1 = __importDefault(require("./sampleBusStation"));
//====================================================================================================================================
exports.default = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("bus_Stations", sampleBusStation_1.default);
        console.log("bus stations successfully inserted!");
    },
    //-------------------------------------------------------------------
    async down(queryInterface) {
        await queryInterface.bulkDelete("bus_Stations", {
            id: ["S001", "S002", "S003", "S004"],
        });
        console.log("bus stations successfully removed!");
    },
};
//# sourceMappingURL=busStationSeeder.js.map