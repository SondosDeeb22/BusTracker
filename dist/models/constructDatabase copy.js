"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = void 0;
//==============================================================================================
//? importing
//==============================================================================================
// import  sequelize from '../database/database';
const database_1 = require("../config/database");
// running the models for thier side-effects(for them to be added in sequelize.model )
// import UserModel from './userModel';
require("./userModel");
require("./busModel");
require("./busScheduleModel");
require("./routeModel");
// import ReportModel from '../models/reportsModel';
// import AppointmentModel from '../models/appointmentModel';
// import LoginAttemptModel from '../models/login_attempModel';
// //import the association 
// import './association';
// //import the seeders
// import users from '../seeders/sampleUser';
// import appointments from '../seeders/sampleAppointment';
// import reports from '../seeders/sampleReport';
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
        // await ReportModel.destroy({ where: {}});
        // await AppointmentModel.destroy({ where: {}});
        // await LoginAttemptModel.destroy({ where: {}})
        // await UserModel.destroy({ where: {}});
        // // 2- Insert sample data
        // await UserModel.bulkCreate(users, {
        //   returning: true,
        // });
        // await AppointmentModel.bulkCreate(appointments, {
        //   returning: true,
        // });
        // await ReportModel.bulkCreate(reports, {
        //   returning: true,
        // });
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
    // await seedData();
};
exports.initDB = initDB;
//# sourceMappingURL=constructDatabase%20copy.js.map