"use strict";
// ====================================================================================================================================
//? Import
// ====================================================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sampleLoginAttempt_1 = __importDefault(require("./sampleLoginAttempt"));
//====================================================================================================================================
exports.default = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("login_attempt", sampleLoginAttempt_1.default);
        console.log("login_attempt successfully inserted!");
    },
    //-------------------------------------------------------------------
    async down(queryInterface) {
        await queryInterface.bulkDelete("login_attempt", {
            userEmail: [
                "alice@example.com",
                "bob@example.com",
                "carol@example.com",
                "david@example.com",
                "eve@example.com",
            ],
        });
        console.log("login_attempt successfully removed!");
    },
};
//# sourceMappingURL=loginAttemptSeeder.js.map