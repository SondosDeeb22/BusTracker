"use strict";
// ====================================================================================================================================
//? Import
// ====================================================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sampleRoute_1 = __importDefault(require("./sampleRoute"));
//====================================================================================================================================
exports.default = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("routes", sampleRoute_1.default);
        console.log("routes successfully inserted!");
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("routes", {
            id: ["R001", "R002", "R003", "R004"],
        });
        console.log("routes successfully removed!");
    },
};
//# sourceMappingURL=routeSeeders.js.map