export declare class StationService {
    private fetchDefaultStationIdsByType;
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
    fetchDefaultStations(): Promise<{
        messageKey: string;
        data: unknown;
    }>;
    fetchStationsForPicker(): Promise<{
        messageKey: string;
        data: unknown;
    }>;
    fetchDefaultStartStations(): Promise<{
        messageKey: string;
        data: unknown;
    }>;
    fetchDefaultEndStations(): Promise<{
        messageKey: string;
        data: unknown;
    }>;
}
//# sourceMappingURL=stationService.d.ts.map