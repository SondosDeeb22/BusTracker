import { RequestLike } from "./types";
export declare const createEmailUrlToken: (email: string, envKeyName: string, expiresInMs?: number) => string;
export declare const createResetPasswordUrlToken: (email: string) => string;
export declare const createSetPasswordUrlToken: (email: string) => string;
export declare const verifyUrlToken: <T extends object>(token: string, secretKey: string) => T | null;
export declare const verifyUrlTokenFromRequest: <T extends object>(req: RequestLike, secretKey: string) => T | null;
export declare const verifyUrlTokenFromRequestWithEnvKey: <T extends object>(req: RequestLike, envKeyName: string) => T | null;
export declare const verifyResetPasswordUrlTokenFromRequest: <T extends object>(req: RequestLike) => T | null;
export declare const verifySetPasswordUrlTokenFromRequest: <T extends object>(req: RequestLike) => T | null;
//# sourceMappingURL=urlTokens.d.ts.map