import { Request, Response } from 'express';
export declare class AuthController {
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    sendEmailToResetPassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map