//==========================================================================================================
//? Import
//==========================================================================================================

import LoginAttemptModel from "../../models/loginAttempModel";

import { userIPaddressAndLocation } from "../../interfaces/helper&middlewareInterface";

import { RequestLike } from "./types";

import { getIPaddressAndUserLocation } from "./ipLocation";

//==========================================================================================================

export const loginAttempt = async (req: RequestLike, attemptSuccessful: boolean, userEmail: string): Promise<void> => {
    try {
        const IPaddressAndLocation: userIPaddressAndLocation = await getIPaddressAndUserLocation(req);

        await LoginAttemptModel.create({
            userEmail: userEmail,
            IPaddress: IPaddressAndLocation.ip,
            attemptLocation: IPaddressAndLocation.location,
            attemptSuccessful: attemptSuccessful,
            attemptTime: new Date().toTimeString().slice(0, 8),
            attemptDate: new Date(),
        });
    } catch (error) {
        console.error("Error occured while storing login attempt.", error);
        return;
    }
};
