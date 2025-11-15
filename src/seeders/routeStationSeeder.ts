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
    await queryInterface.bulkDelete("route_stations", {
      routeStationId: [
        "RS01",
        "RS02",
        "RS03",
        "RS04",
        "RS05",
        "RS06",
        "RS07",
        "RS08",
        "RS09",
        "RS10",
        "RS11",
        "RS12",
      ],
    });
    console.log("route stations successfully removed!");
  },
};
