import { Request, Response } from "express";
import { emailInterface } from "../interfaces/authServiceInterface";
import { role } from '../enums/userEnum';
type AuthServiceResult<T = undefined> = {
    status: number;
    messageKey: string;
    data?: T;
};
declare class AuthService {
    getCurrentUser(req: Request, res: Response): Promise<AuthServiceResult<{
        userID: number;
        userRole: string;
        userName: string;
    }>>;
    login(req: Request, res: Response): Promise<AuthServiceResult>;
    logout(req: Request, res: Response): Promise<AuthServiceResult>;
    sendEmailToResetPassword(req: Request, res: Response, targetRole: role): Promise<AuthServiceResult>;
    verifyToken(req: Request, res: Response, secretKey: string): Promise<emailInterface | null>;
    resetPassword(req: Request, res: Response): Promise<AuthServiceResult>;
    sendValidateEmail(email: string): Promise<AuthServiceResult>;
    setPassword(req: Request, res: Response): Promise<AuthServiceResult>;
}
export default AuthService;
//# sourceMappingURL=authService.d.ts.map