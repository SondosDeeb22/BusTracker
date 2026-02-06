//==========================================================================================================
//? Import
//==========================================================================================================

import jwt from "jsonwebtoken";

import { RequestLike } from "./types";

import { getEnvSecretKey } from "./env";

//==========================================================================================================


// ======================================================================================
// function to create a url token
// ======================================================================================
export const createEmailUrlToken = (email: string, envKeyName: string, expiresInMs: number = 1200000): string => {
    const secretKey = getEnvSecretKey(envKeyName);
    return jwt.sign({ email }, secretKey, { expiresIn: expiresInMs / 1000 });
};


// ===================================================================================
// function to create a reset password url token
// ===================================================================================
export const createResetPasswordUrlToken = (email: string): string => {
    const secretKey = getEnvSecretKey("JWT_RESET_PASSWORD_KEY");
    return jwt.sign({ email }, secretKey, { expiresIn: 1200000 / 1000 });
};

export const createResetPasswordUrlTokenWithVersion = (email: string, passwordResetVersion: number): string => {
    const secretKey = getEnvSecretKey("JWT_RESET_PASSWORD_KEY");
    return jwt.sign({ email, v: passwordResetVersion }, secretKey, { expiresIn: 1200000 / 1000 });
};

//  ==================================================================================
// function to create a set password url token
//  ==================================================================================
export const createSetPasswordUrlToken = (email: string): string => {
    return createEmailUrlToken(email, "JWT_SET_PASSWORD_KEY");
};

//  ==================================================================================
// function to verify a url token
//  ==================================================================================
export const verifyUrlToken = <T extends object>(token: string, secretKey: string): T | null => {
    try {
        const data = jwt.verify(token, secretKey) as T;
        if (!data || typeof data !== "object") {
            return null;
        }
        return data;
    } catch (error) {
        return null;
    }
};

// ==================================================================================
// function to verify a url token from request
// ==================================================================================
export const verifyUrlTokenFromRequest = <T extends object>(req: RequestLike, secretKey: string): T | null => {
    const token = String(req.params?.token || req.query?.token);
    if (!token) {
        return null;
    }
    return verifyUrlToken<T>(token, secretKey);
};


// ==================================================================================
// function to verify a url token from request with env key
// ==================================================================================
export const verifyUrlTokenFromRequestWithEnvKey = <T extends object>(req: RequestLike, envKeyName: string): T | null => {
    const secretKey = getEnvSecretKey(envKeyName);
    return verifyUrlTokenFromRequest<T>(req, secretKey);
};


// ==================================================================================
// function to verify a reset password url token from request
// ==================================================================================
export const verifyResetPasswordUrlTokenFromRequest = <T extends object>(req: RequestLike): T | null => {
    return verifyUrlTokenFromRequestWithEnvKey<T>(req, "JWT_RESET_PASSWORD_KEY");
};


// ==================================================================================
// function to verify a set password url token from request
// ==================================================================================
export const verifySetPasswordUrlTokenFromRequest = <T extends object>(req: RequestLike): T | null => {
    return verifyUrlTokenFromRequestWithEnvKey<T>(req, "JWT_SET_PASSWORD_KEY");
};
