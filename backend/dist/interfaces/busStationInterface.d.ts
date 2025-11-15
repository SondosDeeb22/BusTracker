import { status } from "../enums/busStationEnum";
export interface BusStationAttributes {
    id: string;
    stationName: string;
    latitude: number;
    longitude: number;
    status: keyof typeof status;
}
//# sourceMappingURL=busStationInterface.d.ts.map