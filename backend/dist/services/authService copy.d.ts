import { Request, Response } from "express";
import { emailInterface } from "../interfaces/authServiceInterface";
declare class AuthService {
    getCurrentUser(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    sendPasswordResetEmail(req: Request, res: Response): Promise<void>;
    verifyResetPasswordToken(req: Request, res: Response): Promise<void | string | emailInterface>;
    resetPassword(req: Request, res: Response): Promise<string | void>;
    sendValidateEmail(res: Response, email: string): Promise<void>;
    setPassword(req: Request, res: Response): Promise<string | void>;
}
export default AuthService;
//# sourceMappingURL=authService%20copy.d.ts.map