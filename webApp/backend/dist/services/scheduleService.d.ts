export declare class ScheduleService {
    getSchedule(params: {
        date?: string;
        servicePatternId?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<{
        scheduleId: any;
        date: any;
        day: any;
        servicePatternId: any;
        servicePattern: any;
        timeline: {
            time: string;
            trips: any[];
        }[];
    }[]>;
    getUserSchedule(params: {
        date?: string;
        servicePatternId?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<{
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
    removeScheduledTrip(detailedScheduleId: string): Promise<void>;
    addSchedule(input: {
        date: string;
        day: string;
        servicePatternId: string;
    }): Promise<void>;
    addScheduledTrip(input: {
        scheduleId: string;
        time: string;
        routeId: string;
        driverId: string;
        busId: string;
    }): Promise<'tripForm.success.saved' | 'tripForm.success.updated'>;
    updateSchedule(updates: {
        scheduleId: string;
        date?: string;
        day?: string;
        servicePatternId?: string;
    }): Promise<boolean>;
    removeSchedule(scheduleId: string): Promise<void>;
}
//# sourceMappingURL=scheduleService.d.ts.map