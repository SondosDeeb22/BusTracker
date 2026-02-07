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
                id: string;
                name: string;
                role: string;
            };
        }
    }
}

// ===============================================
export {};
