"use strict";
// ====================================================================================================================================
//? Import
// ====================================================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sampleUser_1 = __importDefault(require("./sampleUser"));
//====================================================================================================================================
exports.default = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("users", sampleUser_1.default);
        console.log("users successfully inserted!");
    },
    //-------------------------------------------------------------------
    async down(queryInterface) {
        await queryInterface.bulkDelete("users", {
            id: [1001, 1002, 1003, 1004],
        });
        console.log("users successfully removed!");
    },
};
//# sourceMappingURL=userSeeder.js.map