// ====================================================================================================================================
//? Import
// ====================================================================================================================================

import { QueryInterface } from "sequelize";
import users from "./sampleUser";

//====================================================================================================================================

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert("users", users as any[]);
    console.log("users successfully inserted!");
  },

  //-------------------------------------------------------------------
  
  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete("users", {
      id: [1001, 1002, 1003, 1004],
    });
    console.log("users successfully removed!");
  },
};
