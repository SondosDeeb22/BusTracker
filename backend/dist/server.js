"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//===========================================================================================================
//? Import Required Modules and Set Port:
//===========================================================================================================
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
// import displayMessage from '../frontend/src/script'; // Removed: backend shouldn't import frontend code directly
//const io = require('socket.io')(http);
const port = Number(process.env.SERVER_PORT) || 3000;
const constructDatabase_1 = require("./database/constructDatabase");
//===========================================================================================================
//? Create HTTP Server and Initialize Express App:
//===========================================================================================================
const server = http_1.default.createServer(app_1.default); //method to creates an HTTP server and passes Express app to handle incoming requests.
// Initialize Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        // methods: ["GET", "POST"]
    }
});
//===========================================================================================================
const startServer = async () => {
    try {
        await (0, constructDatabase_1.initDB)(); // construct the database ///?
        //--------------------------------
        io.on("connection", function (socket) {
            socket.on("send-location", function (data) {
                io.emit("receive-location", { id: socket.id, ...data });
            });
            socket.on("disconnect", function () {
                io.emit("user-disconnected", socket.id);
            });
        });
        //--------------------------------
        server.listen(port, () => {
            console.log(`Server is successfully running on port: ${port}`);
        });
        //===========================================
    }
    catch (error) {
        console.log("Error occured while initelizing the database");
        process.exit(1); // we will stop the app if the database building failed
    }
};
// server.listen(port)
startServer();
//# sourceMappingURL=server.js.map