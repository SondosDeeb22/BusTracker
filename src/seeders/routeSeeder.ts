// ====================================================================================================================================
//? Import
// ====================================================================================================================================

import { QueryInterface } from "sequelize";
import routes from "./sampleRoute";

//====================================================================================================================================

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert("routes", routes as any[]);
    console.log("routes successfully inserted!");
  },
  //-------------------------------------------------------------------

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete("routes", {
      id: ["R001", "R002", "R003", "R004"],
    });
    console.log("routes successfully removed!");
  },
};
