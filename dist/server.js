"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//===========================================================================================================
//? Import Required Modules and Set Port:
//===========================================================================================================
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const port = Number(process.env.SERVER_PORT) || 3000;
const constructDatabase_1 = require("./database/constructDatabase");
//===========================================================================================================
//? Create HTTP Server and Initialize Express App:
//===========================================================================================================
const server = http_1.default.createServer(app_1.default); //method to creates an HTTP server and passes Express app to handle incoming requests.
//===========================================================================================================
const startServer = async () => {
    try {
        await (0, constructDatabase_1.initDB)(); // construct the database ///?
        server.listen(port, () => {
            console.log(`Server is successfully running on port: ${port}`);
        });
    }
    catch (error) {
        console.log("Error occured while initelizing the database");
        process.exit(1); // we will stop the app if the database building failed
    }
};
// server.listen(port)
startServer();
//# sourceMappingURL=server.js.map