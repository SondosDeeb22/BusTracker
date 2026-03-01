export declare class BusService {
    addBus(payload: Record<string, any>): Promise<{
        messageKey: string;
    }>;
    removeBus(busId: unknown): Promise<{
        messageKey: string;
    }>;
    updateBus(values: Record<string, any>): Promise<{
        updated: boolean;
        messageKey: string;
    }>;
    viewBuses(displayAll: boolean): Promise<{
        messageKey: string;
        data: unknown;
    }>;
}
//# sourceMappingURL=busService.d.ts.map