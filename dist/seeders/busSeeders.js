"use strict";
// ====================================================================================================================================
//? Import
// ====================================================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sampleBus_1 = __importDefault(require("./sampleBus"));
//====================================================================================================================================
exports.default = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("buses", sampleBus_1.default);
        console.log("buses successfully inserted!");
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("buses", {
            id: ["B001", "B002", "B003", "B004"],
        });
        console.log("buses successfully removed!");
    },
};
//# sourceMappingURL=busSeeders.js.map