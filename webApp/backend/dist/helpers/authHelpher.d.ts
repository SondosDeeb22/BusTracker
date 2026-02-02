import { userIPaddressAndLocation } from "../interfaces/helper&middlewareInterface";
type RequestLike = {
    cookies: Record<string, string | undefined>;
    ip?: string | undefined;
};
type ResponseLike = {
    cookie: (name: string, value: string, options?: Record<string, unknown>) => unknown;
    clearCookie: (name: string, options?: Record<string, unknown>) => unknown;
};
declare class AuthHelper {
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