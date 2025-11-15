"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = void 0;
//==============================================================================================
//? importing
//==============================================================================================
// import  sequelize from '../database/database';
const database_1 = require("../config/database");
// running the models for thier side-effects(for them to be added in sequelize.model )
const userModel_1 = __importDefault(require("./userModel"));
const busModel_1 = __importDefault(require("./busModel"));
const busScheduleModel_1 = __importDefault(require("./busScheduleModel"));
const routeModel_1 = __importDefault(require("./routeModel"));
const busStationModel_1 = __importDefault(require("./busStationModel"));
const routeStationModel_1 = __importDefault(require("./routeStationModel"));
//import the association 
require("./association");
//import the seeders
const sampleUser_1 = __importDefault(require("../seeders/sampleUser"));
const sampleBus_1 = __importDefault(require("../seeders/sampleBus"));
const sampleBusSchedule_1 = __importDefault(require("../seeders/sampleBusSchedule"));
const sampleRoute_1 = __importDefault(require("../seeders/sampleRoute"));
const sampleBusStation_1 = __importDefault(require("../seeders/sampleBusStation"));
const sampleRouteStation_1 = __importDefault(require("../seeders/sampleRouteStation"));
//==============================================================================================
//? build all the table
//==============================================================================================
const buildModel = async () => {
    try {
        //build all the tables
        await database_1.sequelize.sync({ force: true }); //this line looks at all the models I imported (e.x:  import './models/usersModel' etc) then it creates or alters the tables based on my model's definitions
        console.log('Models constructured successfully');
    }
    catch (error) {
        console.log('Error occured: ', error);
    }
};
//==============================================================================================
//? seed the tables with sample data
//==============================================================================================
const seedData = async () => {
    try {
        // 1- Delete all data (if we had data before, so we have no conflicts)
        await userModel_1.default.destroy({ where: {} });
        await busScheduleModel_1.default.destroy({ where: {} });
        await routeStationModel_1.default.destroy({ where: {} });
        await busModel_1.default.destroy({ where: {} });
        await busStationModel_1.default.destroy({ where: {} });
        await routeModel_1.default.destroy({ where: {} });
        // 2- Insert sample data
        await userModel_1.default.bulkCreate(sampleUser_1.default, {
            returning: true
        });
        await routeModel_1.default.bulkCreate(sampleRoute_1.default, {
            returning: true
        });
        await busModel_1.default.bulkCreate(sampleBus_1.default, {
            returning: true
        });
        await busStationModel_1.default.bulkCreate(sampleBusStation_1.default, {
            returning: true
        });
        await routeStationModel_1.default.bulkCreate(sampleRouteStation_1.default, {
            returning: true
        });
        await busScheduleModel_1.default.bulkCreate(sampleBusSchedule_1.default, {
            returning: true
        });
        console.log('Data seeded successfully');
        //---------------------------------------------------------------
    }
    catch (error) {
        console.log("error occured ", error);
        return;
    }
};
//==============================================================================================
const initDB = async () => {
    await buildModel();
    await seedData();
};
exports.initDB = initDB;
//# sourceMappingURL=constructDatabase.js.map