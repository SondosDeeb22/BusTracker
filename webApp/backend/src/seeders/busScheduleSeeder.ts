// ====================================================================================================================================
//? Import
// ====================================================================================================================================

import { QueryInterface } from "sequelize";
import busSchedules from "./sampleBusSchedule";

//====================================================================================================================================

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert("bus_schedule", busSchedules as any[]);
    console.log("bus schedules successfully inserted!");
  },
  //-------------------------------------------------------------------

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete("bus_schedule", {
      id: ["SCH1", "SCH2", "SCH3", "SCH4"],
    });
    console.log("bus schedules successfully removed!");
  },
};
