import { Request, Response } from 'express';
import { emailInterface } from "../interfaces/authServiceInterface";
export declare class AuthController {
    login(req: Request, res: Response): Promise<void>;
    getCurrentUser(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    sendEmailToResetAdminPassword(req: Request, res: Response): Promise<void>;
    sendEmailToResetDriverPassword(req: Request, res: Response): Promise<void>;
    verifyResetPasswordToken(req: Request, res: Response): Promise<emailInterface | null>;
    resetPassword(req: Request, res: Response): Promise<void>;
    sendValidateEmail(req: Request, res: Response, email: string): Promise<void>;
    verifySetPasswordToken(req: Request, res: Response): Promise<emailInterface | null>;
    setPassword(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map