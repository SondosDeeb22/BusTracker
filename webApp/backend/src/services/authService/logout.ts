//==========================================================================================================
//? Import
//==========================================================================================================

import { AuthRequest, AuthResponse } from "../../types/express/auth";

import AuthHelper from "../../helpers/authHelpher";
const authHelper = new AuthHelper();

import { UnauthorizedError } from "../../errors";

import { AuthServiceResult } from "./types";

//==========================================================================================================

export const logout = async (req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult> => {
    try {
        authHelper.getUserData(req);
        authHelper.clearLoginSession(res);

        return { status: 200, messageKey: "auth.logout.success" };

    // -----------------------------------------------------------
    } catch (error) {
        console.error("Error during logout.", error);

        if (error instanceof UnauthorizedError) {
            return { status: 401, messageKey: error.message };
        }

        return { status: 500, messageKey: "common.errors.internal" };
    }
};
