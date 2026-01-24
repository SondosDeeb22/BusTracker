import { Request, Response } from "express";
import { emailInterface } from "../interfaces/authServiceInterface";
declare class AuthService {
    getCurrentUser(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    sendEmailToResetPassword(req: Request, res: Response): Promise<void>;
    verifyToken(req: Request, res: Response, secretKey: string): Promise<emailInterface | null>;
    resetPassword(req: Request, res: Response): Promise<void>;
    sendValidateEmail(res: Response, email: string): Promise<void>;
    setPassword(req: Request, res: Response): Promise<void>;
}
export default AuthService;
//# sourceMappingURL=authService.d.ts.map