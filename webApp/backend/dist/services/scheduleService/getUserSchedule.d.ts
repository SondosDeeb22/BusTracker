import { ScheduleQueryParams } from "./types";
export declare const getUserSchedule: (params: ScheduleQueryParams) => Promise<{
    dayKey: string;
    date: string;
    servicePatterns: {
        servicePatternId: string;
        title: string;
        operatingTimes: string[];
        routes: {
            routeName: string;
            tabColorValue: number;
            departureTimes: string[];
        }[];
    }[];
}[]>;
//# sourceMappingURL=getUserSchedule.d.ts.map