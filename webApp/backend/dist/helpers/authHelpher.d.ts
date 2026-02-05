import { JWTdata, userIPaddressAndLocation } from "../interfaces/helper&middlewareInterface";
type RequestLike = {
    cookies?: Record<string, string | undefined>;
    ip?: string | undefined;
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
};
type ResponseLike = {
    cookie?: (name: string, value: string, options?: Record<string, unknown>) => unknown;
    setCookie?: (name: string, value: string, options?: Record<string, unknown>) => unknown;
    clearCookie: (name: string, options?: Record<string, unknown>) => unknown;
};
declare class AuthHelper {
    createLoginSession(res: ResponseLike, payload: JWTdata): string;
    clearLoginSession(res: ResponseLike): null;
    getUserData(req: RequestLike): JWTdata;
    private getCookieSetter;
    private getEnvSecretKey;
    createEmailUrlToken(email: string, envKeyName: string, expiresInMs?: number): string;
    createResetPasswordUrlToken(email: string): string;
    createSetPasswordUrlToken(email: string): string;
    verifyUrlToken<T extends object>(token: string, secretKey: string): T | null;
    verifyUrlTokenFromRequest<T extends object>(req: RequestLike, secretKey: string): T | null;
    verifyUrlTokenFromRequestWithEnvKey<T extends object>(req: RequestLike, envKeyName: string): T | null;
    verifyResetPasswordUrlTokenFromRequest<T extends object>(req: RequestLike): T | null;
    verifySetPasswordUrlTokenFromRequest<T extends object>(req: RequestLike): T | null;
    createJWTtoken(res: ResponseLike, tokenName: string, secretKey: string, components: {
        [key: string]: number | string | boolean;
    }, maximumAge: number, storeCookie: boolean): string;
    removeCookieToken(res: ResponseLike, tokenName: string): null;
    extractJWTData: <tokentInterface>(req: RequestLike, tokenName: string, secretKey: string) => tokentInterface;
    getIPaddressAndUserLocation: (req: RequestLike) => Promise<userIPaddressAndLocation>;
    loginAttempt(req: RequestLike, attemptSuccessful: boolean, userEmail: string): Promise<void>;
    validateUserById(driverId: number, busId: string): Promise<true>;
}
export default AuthHelper;
//# sourceMappingURL=authHelpher.d.ts.map