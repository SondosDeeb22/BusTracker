//==========================================================================================================
//? Import
//==========================================================================================================

import jwt from "jsonwebtoken";

import { UnauthorizedError } from "../../errors";

import { RequestLike } from "./types";

//==========================================================================================================

export const extractJWTData = <TokenInterface>(
    req: RequestLike,
    tokenName: string,
    secretKey: string
): TokenInterface => {
    try {
        const token: string | undefined = req.cookies?.[tokenName];

        if (!token) {
            throw new UnauthorizedError("common.auth.sessionExpired");
        }

        const user_data = jwt.verify(token, secretKey) as TokenInterface;
        if (!user_data || typeof user_data !== "object") {
            throw new UnauthorizedError("common.auth.invalidToken");
        }
        return user_data;
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            throw error;
        }
        throw new UnauthorizedError("common.errors.unauthorized");
    }
};
