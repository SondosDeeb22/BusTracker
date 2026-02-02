// =====================================================
// ?import 
// ===============================================
import 'express';

// ===================================================================
// add user interface to express request

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                name: string;
                role: string;
            };
        }
    }
}

// ===============================================
export {};
