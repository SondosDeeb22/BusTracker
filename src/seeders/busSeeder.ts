// ====================================================================================================================================
//? Import
// ====================================================================================================================================

import { QueryInterface } from "sequelize";
import buses from "./sampleBus";

//====================================================================================================================================

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert("buses", buses as any[]);
    console.log("buses successfully inserted!");
  },
  //-------------------------------------------------------------------

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete("buses", {
      id: ["B001", "B002", "B003", "B004"],
    });
    console.log("buses successfully removed!");
  },
};
