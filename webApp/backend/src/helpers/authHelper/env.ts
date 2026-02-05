//==========================================================================================================
//? Import
//==========================================================================================================

import { InternalError } from "../../errors";

//==========================================================================================================

export const getEnvSecretKey = (envKeyName: string): string => {
    const value = process.env[envKeyName];
    const secretKey = typeof value === "string" ? value.trim() : "";
    if (!secretKey) {
        throw new InternalError("common.errors.internal");
    }
    return secretKey;
};
