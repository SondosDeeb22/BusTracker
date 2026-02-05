import { AddScheduleInput, UpdateScheduleInput } from "./types";
export declare const addSchedule: (input: AddScheduleInput) => Promise<void>;
export declare const updateSchedule: (updates: UpdateScheduleInput) => Promise<boolean>;
export declare const removeSchedule: (scheduleId: string) => Promise<void>;
//# sourceMappingURL=crud.d.ts.map