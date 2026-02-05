import { AuthRequest, AuthResponse } from "../../types/express/auth";
import { AuthServiceResult } from "./types";
export declare const getCurrentUser: (req: AuthRequest, res: AuthResponse) => Promise<AuthServiceResult<{
    userID: number;
    userRole: string;
    userName: string;
}>>;
//# sourceMappingURL=getCurrentUser.d.ts.map