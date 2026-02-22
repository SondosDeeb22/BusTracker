import { defaultType, status } from "../enums/stationEnum";
export interface stationAttributes {
    id: string;
    stationName: string;
    latitude: number;
    longitude: number;
    status: keyof typeof status;
    isDefault?: boolean;
    defaultType?: keyof typeof defaultType;
}
export interface stationListObjects {
    id: string;
}
//# sourceMappingURL=stationInterface.d.ts.map