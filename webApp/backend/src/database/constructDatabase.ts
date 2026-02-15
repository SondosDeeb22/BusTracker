//==============================================================================================
//? importing
//==============================================================================================
// import  sequelize from '../database/database';
import { sequelize } from '../config/database';

// running the models for thier side-effects(for them to be added in sequelize.model )

import UserModel from '../models/userModel';
import BusModel from '../models/busModel';
import BusScheduleModel from '../models/busScheduleModel';
import RouteModel from '../models/routeModel';
import stationModel from '../models/stationModel';
import RouteStationModel from '../models/routeStationModel';
import loginAttemptModel from '../models/loginAttempModel';

import ScheduledTripsModel from '../models/scheduledTripsModel';
import ServicePatternModel from '../models/servicePatternModel';
import OperatingHoursModel from '../models/operatingHoursModel';
import TripModel from '../models/scheduledTripsModel';

import LiveLocation from '../models/liveLocationModel'
//import the association 
import '../models/association';

//import the seeders
import users from '../seeders/sampleUser';
import buses from '../seeders/sampleBus';
import busSchedules from '../seeders/sampleBusSchedule';
import routes from '../seeders/sampleRoute';
import busStations from '../seeders/sampleBusStation';
import routeStation from '../seeders/sampleRouteStation';
import loginAttempts from '../seeders/sampleLoginAttempt';

import operatingHours from '../seeders/sampleOperatingHours';
import servicePatterns from '../seeders/sampleServicePattern';
import trips from '../seeders/sampleScheduledTrips';
import schedules from '../seeders/sampleSchedule';
import ScheduleModel from '../models/scheduleModel';
//==============================================================================================
//? build all the table
//==============================================================================================
const buildModel = async () =>{
  try{
    //build all the tables
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({force: true}); //this line looks at all the models I imported (e.x:  import './models/usersModel' etc) then it creates or alters the tables based on my model's definitions
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Models constructured successfully');

    }
    catch(error){
      console.log('Error occured: ', error);
      try{
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      }catch{
        // ignore
      }
    }
}


//==============================================================================================
//? seed the tables with sample data
//==============================================================================================
const seedData = async () => {
  try{
    // 1- Delete all data (if we had data before, so we have no conflicts)
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');// disabling "FOREIGN_KEY_CHECKS" around delete all data action

    await loginAttemptModel.destroy({where: {}});
    await BusScheduleModel.destroy({where: {}});
    await RouteStationModel.destroy({where: {}});
    await BusModel.destroy({where: {}});
    await stationModel.destroy({where: {}});
    await RouteModel.destroy({where: {}});
    await loginAttemptModel.destroy({where: {}});

    await TripModel.destroy({where: {}});
    await ScheduleModel.destroy({where: {}});
    await OperatingHoursModel.destroy({where: {}});
    await ServicePatternModel.destroy({where: {}});
    await BusModel.destroy({where: {}});
    await stationModel.destroy({where: {}});
    await RouteModel.destroy({where: {}});
    await UserModel.destroy({where: {}});
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');// Enable it after it

    // 2- Insert sample data
    await UserModel.bulkCreate(users, {
      returning: true 
    });

    await RouteModel.bulkCreate(routes, {
      returning: true 
    });

    await BusModel.bulkCreate(buses, {
      returning: true 
    });

    await stationModel.bulkCreate(busStations, {
      returning: true 
    });

    await RouteStationModel.bulkCreate(routeStation, {
      returning: true 
    });

    await BusScheduleModel.bulkCreate(busSchedules, {
      returning: true 
    });
    
    await loginAttemptModel.bulkCreate(loginAttempts, {
      returning: true 
    });



    await ServicePatternModel.bulkCreate(servicePatterns, {
      returning: true 
    });

    await OperatingHoursModel.bulkCreate(operatingHours, {
      returning: true 
    });

    await ScheduleModel.bulkCreate(schedules, {
      returning: true 
    });

    await TripModel.bulkCreate(trips, {
      returning: true 
    });


    console.log('Data seeded successfully');

    //---------------------------------------------------------------
  }catch(error){
    console.log("error occured ", error);
    try{
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }catch{
      // ignore
    }
    return;

  }
}

//==============================================================================================

export const initDB = async () => {
  await buildModel();
  await seedData();
};