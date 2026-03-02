"use strict";
// ====================================================================================================================================
//? Import
// ====================================================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sampleSchedule_1 = __importDefault(require("./sampleSchedule"));
//====================================================================================================================================
exports.default = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("bus_Schedule", sampleSchedule_1.default);
        console.log("bus schedules successfully inserted!");
    },
    //-------------------------------------------------------------------
    async down(queryInterface) {
        await queryInterface.bulkDelete("bus_Schedule", {
            id: ["SCH1", "SCH2", "SCH3", "SCH4"],
        });
        console.log("bus schedules successfully removed!");
    },
};
//# sourceMappingURL=busScheduleSeeder.js.map