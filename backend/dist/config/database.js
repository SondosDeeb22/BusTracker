"use strict";
// ========================================================================
// Unified Database Config and Sequelize Instance
// ========================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.databaseConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
// Load .env
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Detect environment
const isDocker = process.env.IS_DOCKER === 'true';
const databaseHost = isDocker ? 'mysql' : (process.env.DATABASE_HOST || 'localhost');
// Configuration Object (Reusable by Sequelize CLI)
exports.databaseConfig = {
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'bustracker123',
    database: process.env.DATABASE_NAME || 'bus_tracker',
    host: databaseHost,
    port: Number(process.env.DATABASE_PORT) || 3306,
    dialect: process.env.DATABASE_DIALECT || 'mysql',
    define: { timestamps: false },
    logging: false, // Disable logging by default
    retry: { max: 10 },
};
// ========================================================================
// Sequelize Instance (for app use)
// ========================================================================
exports.sequelize = new sequelize_1.Sequelize(exports.databaseConfig.database, exports.databaseConfig.username, exports.databaseConfig.password, {
    host: exports.databaseConfig.host,
    port: exports.databaseConfig.port,
    dialect: exports.databaseConfig.dialect,
    define: exports.databaseConfig.define,
    retry: exports.databaseConfig.retry,
    logging: exports.databaseConfig.logging,
});
//# sourceMappingURL=database.js.map