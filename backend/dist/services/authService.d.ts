import { Request, Response } from "express";
declare class AuthService {
    getCurrentUser(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    sendPasswordResetEmail(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    sendValidateEmail(req: Request, res: Response, email: string): Promise<Response<any, Record<string, any>> | undefined>;
    setPassword(req: Request, res: Response, tokenTitle: string): Promise<void>;
}
export default AuthService;
//# sourceMappingURL=authService.d.ts.map