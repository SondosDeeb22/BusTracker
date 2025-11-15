// ========================================================================
// Unified Database Config and Sequelize Instance
// ========================================================================

import dotenv from 'dotenv';
import path from 'path';
import { Sequelize, Dialect } from 'sequelize';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Detect environment
const isDocker = process.env.IS_DOCKER === 'true';
const databaseHost = isDocker ? 'mysql' : (process.env.DATABASE_HOST || 'localhost');

// Configuration Object (Reusable by Sequelize CLI)
export const databaseConfig = {
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'bustracker123',
  database: process.env.DATABASE_NAME || 'bus_tracker',
  host: databaseHost,
  port: Number(process.env.DATABASE_PORT) || 3306,
  dialect: (process.env.DATABASE_DIALECT as Dialect) || 'mysql',
  define: { timestamps: false },
  logging: false, // Disable logging by default
  retry: { max: 10 },
};

// ========================================================================
// Sequelize Instance (for app use)
// ========================================================================

export const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect,
    define: databaseConfig.define,
    retry: databaseConfig.retry,
    logging: databaseConfig.logging,
  }
);
