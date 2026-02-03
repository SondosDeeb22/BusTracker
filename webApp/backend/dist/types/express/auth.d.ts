export type AuthRequest = {
    body?: any;
    cookies?: Record<string, string | undefined>;
    ip?: string | undefined;
    params?: any;
    query?: any;
};
export type AuthResponse = {
    setCookie: (...args: any[]) => void;
    clearCookie: (...args: any[]) => void;
};
//# sourceMappingURL=auth.d.ts.map