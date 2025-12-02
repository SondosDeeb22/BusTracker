import { Request, Response } from "express";
import { userIPaddressAndLocation } from "../interfaces/helper&middlewareInterface";
declare class AuthHelper {
    createJWTtoken(res: Response, tokenName: string, components: {
        [key: string]: number | string | boolean;
    }, maximumAge: number, storeCookie: boolean): string;
    removeCookieToken(res: Response, tokenName: string): null;
    extractJWTData: <tokentInterface>(req: Request, tokenName: string) => tokentInterface | string;
    getIPaddressAndUserLocation: (req: Request) => Promise<userIPaddressAndLocation | string>;
    loginAttempt(req: Request, res: Response, attemptSuccessful: boolean, userEmail: string, status: number, resultMessage: string): Promise<void>;
    validateUser(req: Request, res: Response, id: string): Promise<boolean>;
}
export default AuthHelper;
//# sourceMappingURL=authHelpher.d.ts.map