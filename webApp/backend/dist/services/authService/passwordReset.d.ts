import { AuthRequest, AuthResponse } from "../../types/express/auth";
import { emailInterface } from "../../interfaces/authServiceInterface";
import { role } from "../../enums/userEnum";
import { AuthServiceResult } from "./types";
export declare const sendEmailToResetPassword: (req: AuthRequest, res: AuthResponse, targetRole: role) => Promise<AuthServiceResult>;
export declare const verifyResetPasswordToken: (req: AuthRequest) => Promise<emailInterface | null>;
export declare const resetPassword: (req: AuthRequest, res: AuthResponse) => Promise<AuthServiceResult>;
//# sourceMappingURL=passwordReset.d.ts.map