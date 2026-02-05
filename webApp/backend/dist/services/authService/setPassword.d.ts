import { AuthRequest, AuthResponse } from "../../types/express/auth";
import { emailInterface } from "../../interfaces/authServiceInterface";
import { AuthServiceResult } from "./types";
export declare const verifySetPasswordToken: (req: AuthRequest) => Promise<emailInterface | null>;
export declare const sendValidateEmail: (email: string) => Promise<AuthServiceResult>;
export declare const setPassword: (req: AuthRequest, res: AuthResponse) => Promise<AuthServiceResult>;
//# sourceMappingURL=setPassword.d.ts.map