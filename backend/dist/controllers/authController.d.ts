import { Request, Response } from 'express';
export declare class AuthController {
    login(req: Request, res: Response): Promise<void>;
    getCurrentUser(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    sendEmailToResetPassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    sendValidateEmail(req: Request, res: Response, email: string): Promise<void>;
    setPassword(req: Request, res: Response): Promise<void | string>;
}
//# sourceMappingURL=authController.d.ts.map