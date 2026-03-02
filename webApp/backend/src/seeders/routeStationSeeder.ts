// ====================================================================================================================================
//? Import
// ====================================================================================================================================

import { QueryInterface } from "sequelize";
import routeStation from "./sampleRouteStation";

//====================================================================================================================================

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert("route_stations", routeStation as any[]);
    console.log("route stations successfully inserted!");
  },
  //-------------------------------------------------------------------

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete("route_stations", {});
    console.log("route stations successfully removed!");
  },
};
