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
app.use(cookieParser());

//===========================================================================================
//? Enable CORS middleware
//===========================================================================================

// app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

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

import trackingRoute from './viewRoutes/trackingRoute';
//===========================================================================================
//? set up routes handler for the API endpoints
//===========================================================================================


app.use('/api/auth', authRoute);


app.use('/api/admin', adminRoute);


app.use('/api/user', userRoute);

app.use('/api/live-location', trackingRoute);

export default app;