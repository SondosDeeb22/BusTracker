//==========================================================================================================
//? Import
//==========================================================================================================

import bcrypt from "bcrypt";

import { Op } from "sequelize";

import { AuthRequest, AuthResponse } from "../../types/express/auth";

// import interfaces ------------------------------------------------------------------------
import { emailInterface, NewPassword } from "../../interfaces/authServiceInterface";

// import Models ------------------------------------------------------------------------
import UserModel from "../../models/userModel";

// import helpers --------------------------------------------------------------------
import AuthHelper from "../../helpers/authHelpher";
const authHelper = new AuthHelper();

import { sendEmail } from "../../helpers/sendEmail";

import { AuthServiceResult } from "./types";

//==========================================================================================================

// =================================================================================================================================
//? Function to verify set password token (for frontend HEAD checks)
// =================================================================================================================================
export const verifySetPasswordToken = async (req: AuthRequest): Promise<emailInterface | null> => {
    try {
        const userData = authHelper.verifySetPasswordUrlTokenFromRequest<emailInterface>(req);
        if (!userData || typeof userData !== "object" || !userData.email) {
            return null;
        }

        // check if user and hashed password exists 
        const user = await UserModel.findOne({
            where: { email: userData.email },
            attributes: ["email", "hashedPassword"],
        });

        
        if (!user) {
            return null;
        }

        
        if (user.hashedPassword != null) {
            return null;
        }
        return userData;

    } catch (error) {
        console.error("Error occured while verifying token.", error);
        return null;
    }
};

//====================================================================================================
//? send Validation Email for new user (in order to set his password)
//=========================================================================================
export const sendValidateEmail = async (email: string): Promise<AuthServiceResult> => {
    const setPasswordTokenCreation = authHelper.createSetPasswordUrlToken(email);

    const mailSubject: string = "Set your Password";
    const setLink = `http://localhost:3000/set-password?token=${setPasswordTokenCreation}`;
    const htmlContent = `
            <p>Hello,</p>

            <p>Your account was created in NEU Bus Tracker platform.</p>

            <p>To finish setting up your account, please set up your password from the link below:</p>

            <a href="${setLink}"
                style="display: inline-block;
                background-color:#59011A;
                color:white;
                text-decoration:none;
                font-weight:bold;
                border-radious: 15px;
                cursor: pointer;
                padding: 12px 24px;">Set Password</a>
            <br><br>
       
            <br><br>

            <p>Please note that this link will expire in 20 minutes</p>`;

    await sendEmail(email, mailSubject, htmlContent);

    return { status: 200, messageKey: "common.crud.sent" };
};

//===================================================================================================================================
//? set password 
//===================================================================================================================================
export const setPassword = async (req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult> => {
    try {
        // ensure token was provided
        const userData = await verifySetPasswordToken(req);

        if (!userData) {
            return { status: 401, messageKey: "common.auth.invalidToken" };
        }

        // get the passwords from the user input ------------------------------------------
        const body: NewPassword = req.body;

        const {
            newPassword,
            confirmPassword,
        } = body;

        if (!newPassword || !confirmPassword) {
            return { status: 500, messageKey: "auth.setPassword.validation.passwordRequired" };
        }

        //ensure the user entered identical passwords
        if (newPassword !== confirmPassword) {
            return { status: 500, messageKey: "auth.setPassword.validation.passwordsMustMatch" };
        }

        // update the password in the database ----------------------------------------------------------

        const hashedPassword: string = await bcrypt.hash(newPassword, 8);

        const [updatedPassword] = await UserModel.update({
            hashedPassword: hashedPassword,
        }, {
            where: {
                email: userData.email,
                hashedPassword: { [Op.is]: null },
            } as unknown as Record<string, unknown>,
        });

        if (updatedPassword === 0) {
            return { status: 401, messageKey: "common.auth.invalidToken" };
        }

        // Clear any existing login session on this browser
        authHelper.clearLoginSession(res);

        return { status: 200, messageKey: "auth.setPassword.success.updated" };

    } catch (error) {
        console.error("Error occurred while setting password.", error);
        return { status: 500, messageKey: "common.errors.internal" };
    }
};
