
//==========================================================================================================
//? Import
//==========================================================================================================

import bcrypt from "bcrypt";

import { AuthRequest, AuthResponse } from "../../types/express/auth";

// import interfaces ------------------------------------------------------------------------
import { loginData } from "../../interfaces/authServiceInterface";
import { JWTdata } from "../../interfaces/helper&middlewareInterface";

// import Models ------------------------------------------------------------------------
import UserModel from "../../models/userModel";

// import helpers --------------------------------------------------------------------
import AuthHelper from "../../helpers/authHelpher";
const authHelper = new AuthHelper();

import { AuthServiceResult } from "./types";

//==========================================================================================================

export const login = async (req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult> => {
    try {
        // the provided login data
        const body: loginData = req.body;

        const {
            email,
            password,
        } = body;

        //check if the user provided all the needed data
        if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
            return { status: 500, messageKey: "common.errors.validation.fillAllFields" };
        }
        const userEmail = email.trim();
        const userPassword: string = password;

        //====================================================================================================================================================
        // check if user registed in the system

        const userExists = await UserModel.findOne({
            where: {
                email: userEmail,
            },
        });

        if (!userExists) {
            return { status: 404, messageKey: "auth.login.userNotFound" };
        }
        //=================================================================================================================================================
        // validate the provided password

        const hashedPassword = userExists.hashedPassword;
        if (typeof hashedPassword !== "string") {
            return { status: 500, messageKey: "common.errors.internal" };
        }

        const validPassword: boolean = await new Promise<boolean>((resolve, reject) => {
            bcrypt.compare(userPassword, hashedPassword, (error, same) => {
                if (error) return reject(error);
                resolve(same);
            });
        });

        let attemptSuccessful: boolean;
        let resultMessage: string;
        let status: number;
        if (validPassword) {
            authHelper.createLoginSession(res, {
                userID: Number(userExists.id),
                userRole: userExists.role,
                userName: userExists.name,
            } as JWTdata);

            attemptSuccessful = true;
            resultMessage = `${userExists.name} logged in`;
            status = 200;
        }
            //=================================================================================================================================================
        else {
            attemptSuccessful = false;
            resultMessage = "password is wrong, please try again";
            status = 401;
        }

        void authHelper.loginAttempt(req, attemptSuccessful, userEmail);

        return { status, messageKey: attemptSuccessful ? "auth.login.success" : "auth.login.invalidCredentials" };

    } catch (error) {
        console.error("Error Found while Logging in.", error);
        return { status: 500, messageKey: "common.errors.internal" };
    }
};
