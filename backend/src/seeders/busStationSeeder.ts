// ====================================================================================================================================
//? Import
// ====================================================================================================================================

import { QueryInterface } from "sequelize";
import busStations from "./sampleBusStation";

//====================================================================================================================================

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert("bus_Stations", busStations as any[]);
    console.log("bus stations successfully inserted!");
  },

  //-------------------------------------------------------------------

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete("bus_Stations", {
      id: ["S001", "S002", "S003", "S004"],
    });
    console.log("bus stations successfully removed!");
  },
};
