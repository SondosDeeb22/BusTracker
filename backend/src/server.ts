//===========================================================================================================
//? Import Required Modules and Set Port:
//===========================================================================================================
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import app from './app';

import path from 'path';
// import displayMessage from '../frontend/src/script'; // Removed: backend shouldn't import frontend code directly
//const io = require('socket.io')(http);
const port: number = Number(process.env.SERVER_PORT)|| 3000;

import {initDB} from './database/constructDatabase';
//===========================================================================================================
//? Create HTTP Server and Initialize Express App:
//===========================================================================================================
const server = http.createServer(app);//method to creates an HTTP server and passes Express app to handle incoming requests.

// Initialize Socket.IO
const io: SocketIOServer = new SocketIOServer(server, {
    cors: {
        origin: "*",
        // methods: ["GET", "POST"]
    }
});

//===========================================================================================================

const startServer = async() => {
    try{
        await initDB(); // construct the database ///?

        //--------------------------------
        io.on("connection", function(socket) {
            socket.on("send-location", function(data) {
                io.emit("receive-location", {id: socket.id, ...data})
            });
            
            socket.on("disconnect", function() {
                io.emit("user-disconnected", socket.id);
            })
        });
        
        //--------------------------------
        server.listen(port,() =>{    
           console.log(`Server is successfully running on port: ${port}`);
        })
    //===========================================
    }
    catch(error){
        console.log("Error occured while initelizing the database");
        process.exit(1); // we will stop the app if the database building failed

    }
};

// server.listen(port)
startServer();