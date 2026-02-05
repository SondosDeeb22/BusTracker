import { AddOrUpdateServicePatternPayload, ServicePatternDto, ServicePatternServiceResult } from "./servicePatternService/types";
export declare class ServicePatternService {
    getServicePatterns(): Promise<{
        messageKey: string;
        data: ServicePatternDto[];
    }>;
    addServicePattern(payload: AddOrUpdateServicePatternPayload): Promise<ServicePatternServiceResult<ServicePatternDto>>;
    updateServicePattern(payload: AddOrUpdateServicePatternPayload): Promise<ServicePatternServiceResult<ServicePatternDto>>;
    deleteServicePattern(servicePatternIdRaw: unknown): Promise<{
        messageKey: string;
    }>;
}
//# sourceMappingURL=servicePatternService.d.ts.map