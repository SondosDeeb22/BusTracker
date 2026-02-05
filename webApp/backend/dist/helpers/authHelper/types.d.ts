export type RequestLike = {
    cookies?: Record<string, string | undefined>;
    ip?: string | undefined;
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
};
export type ResponseLike = {
    cookie?: (name: string, value: string, options?: Record<string, unknown>) => unknown;
    setCookie?: (name: string, value: string, options?: Record<string, unknown>) => unknown;
    clearCookie: (name: string, options?: Record<string, unknown>) => unknown;
};
//# sourceMappingURL=types.d.ts.map