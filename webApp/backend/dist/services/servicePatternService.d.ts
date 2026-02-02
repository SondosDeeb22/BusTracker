type OperatingHourDto = {
    operatingHourId: string;
    hour: string;
};
type ServicePatternDto = {
    servicePatternId: string;
    title: string;
    operatingHours: OperatingHourDto[];
};
export declare class ServicePatternService {
    getServicePatterns(): Promise<{
        messageKey: string;
        data: ServicePatternDto[];
    }>;
    addServicePattern(payload: Record<string, any>): Promise<{
        messageKey: string;
        data: ServicePatternDto;
    }>;
    updateServicePattern(payload: Record<string, any>): Promise<{
        messageKey: string;
        data: ServicePatternDto;
    }>;
    deleteServicePattern(servicePatternIdRaw: unknown): Promise<{
        messageKey: string;
    }>;
}
export {};
//# sourceMappingURL=servicePatternService.d.ts.map