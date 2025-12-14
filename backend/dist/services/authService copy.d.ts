import { Request, Response } from "express";
declare class AuthService {
    getCurrentUser(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    sendPasswordResetEmail(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    sendValidateEmail(res: Response, email: string): Promise<void>;
    setPassword(req: Request, res: Response, tokenTitle: string): Promise<string | void>;
}
export default AuthService;
//# sourceMappingURL=authService%20copy.d.ts.map