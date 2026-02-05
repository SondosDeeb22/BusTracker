import { ScheduleQueryParams } from "./types";
export declare const getSchedule: (params: ScheduleQueryParams) => Promise<{
    scheduleId: any;
    date: any;
    day: any;
    servicePatternId: any;
    servicePattern: any;
    timeline: {
        time: string;
        trips: unknown[];
    }[];
}[]>;
//# sourceMappingURL=getSchedule.d.ts.map