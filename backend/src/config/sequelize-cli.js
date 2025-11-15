// ========================================================================
//  Bridge for Sequelize CLI to use TypeScript Config
// ========================================================================

require('ts-node/register');
const { databaseConfig } = require('./database.ts');

module.exports = {
  development: databaseConfig,
  test: databaseConfig,
  production: databaseConfig,
};
