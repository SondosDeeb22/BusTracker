export declare class DriverService {
    addDriver(payload: Record<string, any>): Promise<{
        messageKey: string;
    }>;
    removeDriver(driverId: unknown): Promise<{
        messageKey: string;
    }>;
    updateDriver(payload: Record<string, any>): Promise<{
        updated: boolean;
        messageKey: string;
    }>;
    fetchAllDrivers(driverId?: unknown): Promise<{
        messageKey: string;
        data: unknown;
    }>;
    fetchDriverProfile(driverId: unknown): Promise<{
        messageKey: string;
        data: unknown;
    }>;
    fetchDriverSchedule(driverId: string): Promise<{
        messageKey: string;
        data: unknown;
    }>;
    buttonsControlUnit(driverId: string): Promise<{
        messageKey: string;
        data: unknown;
    }>;
}
//# sourceMappingURL=driverService.d.ts.map