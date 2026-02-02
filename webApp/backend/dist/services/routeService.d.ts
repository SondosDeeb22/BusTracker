export declare class RouteService {
    addRoute(payload: Record<string, any>): Promise<{
        messageKey: string;
    }>;
    removeRoute(routeId: unknown): Promise<{
        messageKey: string;
    }>;
    updateRoute(payload: Record<string, any>): Promise<{
        messageKey: string;
    }>;
    viewRoutes(displayAll: boolean): Promise<{
        messageKey: string;
        data: unknown;
    }>;
}
//# sourceMappingURL=routeService.d.ts.map