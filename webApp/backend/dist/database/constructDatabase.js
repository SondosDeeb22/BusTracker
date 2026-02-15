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
const userModel_1 = __importDefault(require("../models/userModel"));
const busModel_1 = __importDefault(require("../models/busModel"));
const busScheduleModel_1 = __importDefault(require("../models/busScheduleModel"));
const routeModel_1 = __importDefault(require("../models/routeModel"));
const stationModel_1 = __importDefault(require("../models/stationModel"));
const routeStationModel_1 = __importDefault(require("../models/routeStationModel"));
const loginAttempModel_1 = __importDefault(require("../models/loginAttempModel"));
const servicePatternModel_1 = __importDefault(require("../models/servicePatternModel"));
const operatingHoursModel_1 = __importDefault(require("../models/operatingHoursModel"));
const scheduledTripsModel_1 = __importDefault(require("../models/scheduledTripsModel"));
//import the association 
require("../models/association");
//import the seeders
const sampleUser_1 = __importDefault(require("../seeders/sampleUser"));
const sampleBus_1 = __importDefault(require("../seeders/sampleBus"));
const sampleBusSchedule_1 = __importDefault(require("../seeders/sampleBusSchedule"));
const sampleRoute_1 = __importDefault(require("../seeders/sampleRoute"));
const sampleBusStation_1 = __importDefault(require("../seeders/sampleBusStation"));
const sampleRouteStation_1 = __importDefault(require("../seeders/sampleRouteStation"));
const sampleLoginAttempt_1 = __importDefault(require("../seeders/sampleLoginAttempt"));
const sampleOperatingHours_1 = __importDefault(require("../seeders/sampleOperatingHours"));
const sampleServicePattern_1 = __importDefault(require("../seeders/sampleServicePattern"));
const sampleScheduledTrips_1 = __importDefault(require("../seeders/sampleScheduledTrips"));
const sampleSchedule_1 = __importDefault(require("../seeders/sampleSchedule"));
const scheduleModel_1 = __importDefault(require("../models/scheduleModel"));
//==============================================================================================
//? build all the table
//==============================================================================================
const buildModel = async () => {
    try {
        //build all the tables
        await database_1.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await database_1.sequelize.sync({ force: true }); //this line looks at all the models I imported (e.x:  import './models/usersModel' etc) then it creates or alters the tables based on my model's definitions
        await database_1.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Models constructured successfully');
    }
    catch (error) {
        console.log('Error occured: ', error);
        try {
            await database_1.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        }
        catch {
            // ignore
        }
    }
};
//==============================================================================================
//? seed the tables with sample data
//==============================================================================================
const seedData = async () => {
    try {
        // 1- Delete all data (if we had data before, so we have no conflicts)
        await database_1.sequelize.query('SET FOREIGN_KEY_CHECKS = 0'); // disabling "FOREIGN_KEY_CHECKS" around delete all data action
        await loginAttempModel_1.default.destroy({ where: {} });
        await busScheduleModel_1.default.destroy({ where: {} });
        await routeStationModel_1.default.destroy({ where: {} });
        await busModel_1.default.destroy({ where: {} });
        await stationModel_1.default.destroy({ where: {} });
        await routeModel_1.default.destroy({ where: {} });
        await loginAttempModel_1.default.destroy({ where: {} });
        await scheduledTripsModel_1.default.destroy({ where: {} });
        await scheduleModel_1.default.destroy({ where: {} });
        await operatingHoursModel_1.default.destroy({ where: {} });
        await servicePatternModel_1.default.destroy({ where: {} });
        await busModel_1.default.destroy({ where: {} });
        await stationModel_1.default.destroy({ where: {} });
        await routeModel_1.default.destroy({ where: {} });
        await userModel_1.default.destroy({ where: {} });
        await database_1.sequelize.query('SET FOREIGN_KEY_CHECKS = 1'); // Enable it after it
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
        await stationModel_1.default.bulkCreate(sampleBusStation_1.default, {
            returning: true
        });
        await routeStationModel_1.default.bulkCreate(sampleRouteStation_1.default, {
            returning: true
        });
        await busScheduleModel_1.default.bulkCreate(sampleBusSchedule_1.default, {
            returning: true
        });
        await loginAttempModel_1.default.bulkCreate(sampleLoginAttempt_1.default, {
            returning: true
        });
        await servicePatternModel_1.default.bulkCreate(sampleServicePattern_1.default, {
            returning: true
        });
        await operatingHoursModel_1.default.bulkCreate(sampleOperatingHours_1.default, {
            returning: true
        });
        await scheduleModel_1.default.bulkCreate(sampleSchedule_1.default, {
            returning: true
        });
        await scheduledTripsModel_1.default.bulkCreate(sampleScheduledTrips_1.default, {
            returning: true
        });
        console.log('Data seeded successfully');
        //---------------------------------------------------------------
    }
    catch (error) {
        console.log("error occured ", error);
        try {
            await database_1.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        }
        catch {
            // ignore
        }
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