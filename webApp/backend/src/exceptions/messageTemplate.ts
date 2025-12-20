//===========================================================================================================
//? template function for the messages we want to inform the user about 
//===========================================================================================================

import { Response } from "express";

export const sendResponse = (res: Response, status: number, message: string | null = null , data:object | null = null) => {

    console.log(message , data);
    res.status(status).json({message: message, data});
}


//===========================================================================================================
