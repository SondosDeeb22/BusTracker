//===========================================================================================
//? Initializes  Express framework & creates an instance of the Express application "app" & Import CORS
//(it will be used to define routes, middleware, and handle HTTP requests)
//===========================================================================================

import express, {Express} from 'express'; // importing express function and Express type
import path from 'path';

const app:Express = express();

import cors from 'cors';
//===========================================================================================
//? Import Middlewares & Libraries(modules) we will use
//===========================================================================================

import cookieParser from 'cookie-parser';//middleware for parsing cookies in Express requests
// import AuthService from './services/authService';

//===========================================================================================
//? Enable CORS middleware
//===========================================================================================

const corsOptions: cors.CorsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

//===========================================================================================
//? set up for the middleware( handle json reqestes & url & cookies)
//===========================================================================================

app.use(express.json()); // parse(analyse) incoming requestes with json type
app.use(express.urlencoded({ extended: true }));// parse(analyse) incoming body requests
app.use(cookieParser());// allow reading cookies


app.set("view engine", "ejs"); // set the view engine to ejs

//===========================================================================================
//? Import the Routes
//===========================================================================================

import authRoute from './apiRoutes/authRoute';

import adminRoute from './apiRoutes/adminRoute';

import userRoute from './apiRoutes/userRoute';

import driverRoute from './apiRoutes/driverRoute';

// import trackingRoute from './viewRoutes/trackingRoute';
//===========================================================================================
//? set up routes handler for the API endpoints
//===========================================================================================


app.use('/api/auth', authRoute);


app.use('/api/admin', adminRoute);


app.use('/api/user', userRoute);

app.use('/api/driver', driverRoute);

// app.use('/api/live-location', trackingRoute);

export default app;