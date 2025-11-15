import { Request, Response } from "express";
declare class AuthService {
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    sendPasswordResetEmail(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
}
export default AuthService;
//# sourceMappingURL=authService.d.ts.map