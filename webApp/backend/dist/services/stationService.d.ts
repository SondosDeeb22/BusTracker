export declare class StationService {
    addStation(payload: Record<string, any>): Promise<{
        messageKey: string;
    }>;
    removeStation(stationId: unknown): Promise<{
        messageKey: string;
    }>;
    updateStation(payload: Record<string, any>): Promise<{
        updated: boolean;
        messageKey: string;
    }>;
    fetchAllStations(): Promise<{
        messageKey: string;
        data: unknown;
    }>;
}
//# sourceMappingURL=stationService.d.ts.map