import { status } from "../enums/stationEnum";
export interface stationAttributes {
    id: string;
    stationName: string;
    latitude: number;
    longitude: number;
    status: keyof typeof status;
}
//# sourceMappingURL=stationInterface.d.ts.map