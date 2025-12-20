// ====================================================================================================================================
//? Import
// ====================================================================================================================================

import { QueryInterface } from "sequelize";
import loginAttempts from "./sampleLoginAttempt";

//====================================================================================================================================

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert("login_attempt", loginAttempts as any[]);
    console.log("login_attempt successfully inserted!");
  },

  //-------------------------------------------------------------------
  
  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete("login_attempt", {
      userEmail: [
        "alice@example.com",
        "bob@example.com",
        "carol@example.com",
        "david@example.com",
        "eve@example.com",
      ],
    });
    console.log("login_attempt successfully removed!");
  },
};
