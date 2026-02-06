//==========================================================================================================
//? Import
//==========================================================================================================

import bcrypt from "bcrypt";

import { AuthRequest, AuthResponse } from "../../types/express/auth";

// import interfaces ------------------------------------------------------------------------
import { emailInterface, NewPassword } from "../../interfaces/authServiceInterface";

// import Models ------------------------------------------------------------------------
import UserModel from "../../models/userModel";

//import enums -----------------------
import { role } from "../../enums/userEnum";

// import helpers --------------------------------------------------------------------
import AuthHelper from "../../helpers/authHelpher";
const authHelper = new AuthHelper();

import { createResetPasswordUrlTokenWithVersion } from "../../helpers/authHelper/urlTokens";

import { sendEmail } from "../../helpers/sendEmail";

import { AuthServiceResult } from "./types";

//==========================================================================================================

export const sendEmailToResetPassword = async (
    req: AuthRequest,
    res: AuthResponse,
    targetRole: role
): Promise<AuthServiceResult> => {
    try {
        const body: emailInterface = req.body;

        const {
            email,
        } = body;

        if (!email) {
            return { status: 500, messageKey: "auth.passwordReset.validation.emailRequired" };
        }

        // ensure the user is registred in out DB -------------------------------------------------------------------------------
        const uesrExists = await UserModel.findOne({
            where: {
                email: email,
            },
            attributes: ["email", "role", "passwordResetVersion"],
        });

        if (!uesrExists) {
            return { status: 500, messageKey: "auth.passwordReset.errors.emailNotRegistered" };
        }

        const userRole = uesrExists.role;

        // if the user not allowed to perform this stop the opeartion (e.x: driver trying to reset his passwrod from the admin portal , visa vers )
        if (userRole !== targetRole) {
            return { status: 403, messageKey: "auth.passwordReset.errors.notTargetedRole" };
        }

        //create token and store it in cookie----------------------------------------------------------------------------------
        let resetPasswordTokenCreation: string;
        try {
            resetPasswordTokenCreation = createResetPasswordUrlTokenWithVersion(
                email,
                typeof uesrExists.passwordResetVersion === "number" ? uesrExists.passwordResetVersion : 0
            );

        } catch (error) {
            console.error("Error occured while creating reset password token.", error);
            return { status: 500, messageKey: "auth.common.errors.internal" };
        }

        // ==============================================================================================================================
        const mailSubject: string = "Password Reset";

        // ---------------------------------------------------------------------
        const resetLink = `http://localhost:3000/reset-password?token=${resetPasswordTokenCreation}`;
        const htmlContent = `
            <p>A request has been received to reset the password for your account in NEU Bus Tracker</p>
            <p>If you would like to proceed in this operation, please click on the button below</p>
            <a href="${resetLink}"
                style="display: inline-block;
                background-color:#59011A;
                color:white;
                text-decoration:none;
                font-weight:bold;
                border-radious: 4px;
                cursor: pointer;
                padding: 12px 24px;">Reset Password</a>
            <br><br>
            <p>Please note that this Reset Link will expire in 10 minutes</p>`;

        await sendEmail(email, mailSubject, htmlContent);

        return { status: 200, messageKey: "auth.passwordReset.success.emailSent" };

    } catch (error) {
        console.error("Error occured while sending password reset email.", error);
        return { status: 500, messageKey: "common.errors.internal" };
    }
};

// =================================================================================================================================
//? Function to verify reset password token (for frontend HEAD checks)
// =================================================================================================================================
export const verifyResetPasswordToken = async (req: AuthRequest): Promise<emailInterface | null> => {
    try {
        const userData = authHelper.verifyResetPasswordUrlTokenFromRequest<{ email: string; v?: number }>(req);
        if (!userData || typeof userData !== "object" || !userData.email) {
            return null;
        }

        const user = await UserModel.findOne({
            where: { email: userData.email },
            attributes: ["email", "passwordResetVersion"],
        });

        if (!user) {
            return null;
        }

        const expectedVersion = typeof user.passwordResetVersion === "number" ? user.passwordResetVersion : 0;
        const tokenVersion = typeof userData.v === "number" ? userData.v : 0;
        if (tokenVersion !== expectedVersion) {
            return null;
        }
        return userData;

    } catch (error) {
        console.error("Error occured while verifying token.", error);
        return null;
    }
};

//? =================================================================================================================================
//? Function to reset the password
// =================================================================================================================================
export const resetPassword = async (req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult> => {
    try {
        // ensure token was provided
        const userData = await verifyResetPasswordToken(req);

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
            return { status: 500, messageKey: "auth.passwordReset.validation.passwordRequired" };
        }

        //ensure the user entered identical passwords
        if (newPassword !== confirmPassword) {
            return { status: 500, messageKey: "auth.passwordReset.validation.passwordsMustMatch" };
        }

        // update the password in the database ----------------------------------------------------------

        const hashedPassword: string = await bcrypt.hash(newPassword, 8);

        const [updatedPassword] = await UserModel.update({
            hashedPassword: hashedPassword,
        }, {
            where: {
                email: userData.email,
            },
        });

        if (updatedPassword === 0) {
            return { status: 500, messageKey: "auth.passwordReset.errors.notUpdated" };
        }

        await UserModel.increment(
            { passwordResetVersion: 1 },
            { where: { email: userData.email } }
        );

        return { status: 200, messageKey: "auth.passwordReset.success.updated" };

        //=========================================================================
    } catch (error) {
        console.error("Error occured while resetting the password.", error);

        return { status: 500, messageKey: "common.errors.internal" };
    }
};
