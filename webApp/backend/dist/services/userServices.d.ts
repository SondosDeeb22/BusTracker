export declare class UserService {
    changeLanguage(userId: number, language: unknown): Promise<{
        updated: boolean;
        messageKey: string;
    }>;
    changeAppearance(userId: number, appearance: unknown): Promise<{
        updated: boolean;
        messageKey: string;
    }>;
    changeRoute(userId: number, payload: Record<string, any>): Promise<{
        updated: boolean;
        messageKey: string;
    }>;
    updateBusStatus(userId: number, payload: Record<string, any>): Promise<{
        updated: boolean;
        messageKey: string;
    }>;
}
//# sourceMappingURL=userServices.d.ts.map