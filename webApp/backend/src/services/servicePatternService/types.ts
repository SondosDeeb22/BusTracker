//======================================================================================================================
//? Types
//======================================================================================================================

export type OperatingHourDto = {
    operatingHourId: string;
    hour: string;
};

export type ServicePatternDto = {
    servicePatternId: string;
    title: string;
    operatingHours: OperatingHourDto[];
};

export type ServicePatternServiceResult<T> = {
    messageKey: string;
    data: T;
};

export type AddOrUpdateServicePatternPayload = Record<string, unknown>;
