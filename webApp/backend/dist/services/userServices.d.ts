export declare class UserService {
    changeLanguage(userId: string, language: unknown): Promise<{
        updated: boolean;
        messageKey: string;
    }>;
    changeAppearance(userId: string, appearance: unknown): Promise<{
        updated: boolean;
        messageKey: string;
    }>;
    changeRoute(userId: string, payload: Record<string, any>): Promise<{
        updated: boolean;
        messageKey: string;
    }>;
    updateBusStatus(userId: string, payload: Record<string, any>): Promise<{
        updated: boolean;
        messageKey: string;
    }>;
}
//# sourceMappingURL=userServices.d.ts.map