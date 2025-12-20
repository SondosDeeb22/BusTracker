import { Request, Response } from 'express';
import { emailInterface } from "../interfaces/authServiceInterface";
export declare class AuthController {
    login(req: Request, res: Response): Promise<void>;
    getCurrentUser(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    sendEmailToResetPassword(req: Request, res: Response): Promise<void>;
    verifyResetPasswordToken(req: Request, res: Response): Promise<void | string | emailInterface>;
    resetPassword(req: Request, res: Response): Promise<void | string>;
    sendValidateEmail(req: Request, res: Response, email: string): Promise<void>;
    verifySetPasswordToken(req: Request, res: Response): Promise<void | string | emailInterface>;
    setPassword(req: Request, res: Response): Promise<void | string>;
}
//# sourceMappingURL=authController.d.ts.map