import { ResponseLike } from "./types";
export declare const getCookieSetter: (res: ResponseLike) => ((name: string, value: string, options?: Record<string, unknown>) => unknown);
export declare const createJWTtoken: (res: ResponseLike, tokenName: string, secretKey: string, components: {
    [key: string]: number | string | boolean;
}, maximumAge: number, storeCookie: boolean) => string;
export declare const removeCookieToken: (res: ResponseLike, tokenName: string) => null;
//# sourceMappingURL=cookie.d.ts.map