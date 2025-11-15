//===========================================================================================================
//? Import Required Modules and Set Port:
//===========================================================================================================
import http from 'http';
import app from './app';

const port: number = Number(process.env.SERVER_PORT)|| 3000;

import {initDB} from './database/constructDatabase';
//===========================================================================================================
//? Create HTTP Server and Initialize Express App:
//===========================================================================================================
const server = http.createServer(app);//method to creates an HTTP server and passes Express app to handle incoming requests.

//===========================================================================================================

const startServer = async() => {
    try{
        await initDB(); // construct the database ///?

        server.listen(port,() =>{
           console.log(`Server is successfully running on port: ${port}`);
        })

    }
    catch(error){
        console.log("Error occured while initelizing the database");
        process.exit(1); // we will stop the app if the database building failed

    }
};

// server.listen(port)
startServer();