import { AuthRequest, AuthResponse } from "../types/express/auth";
import { emailInterface } from "../interfaces/authServiceInterface";
import { role } from "../enums/userEnum";
import { AuthServiceResult } from "./authService/types";
declare class AuthService {
    getCurrentUser(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult<{
        userID: number;
        userRole: string;
        userName: string;
    }>>;
    login(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult>;
    logout(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult>;
    sendEmailToResetPassword(req: AuthRequest, res: AuthResponse, targetRole: role): Promise<AuthServiceResult>;
    verifyResetPasswordToken(req: AuthRequest): Promise<emailInterface | null>;
    verifySetPasswordToken(req: AuthRequest): Promise<emailInterface | null>;
    resetPassword(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult>;
    sendValidateEmail(email: string): Promise<AuthServiceResult>;
    setPassword(req: AuthRequest, res: AuthResponse): Promise<AuthServiceResult>;
}
export default AuthService;
//# sourceMappingURL=authService.d.ts.map