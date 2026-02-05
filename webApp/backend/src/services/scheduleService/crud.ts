//===================================================================================================
//? Import
//===================================================================================================

import ScheduleModel from "../../models/scheduleModel";

//helper
import { UserHelper } from "../../helpers/userHelper";
const userHelper = new UserHelper();

import { AddScheduleInput, UpdateScheduleInput } from "./types";

//===================================================================================================

export const addSchedule = async (input: AddScheduleInput): Promise<void> => {
    await userHelper.add(ScheduleModel, { date: input.date, day: input.day, servicePatternId: input.servicePatternId });
};

export const updateSchedule = async (updates: UpdateScheduleInput): Promise<boolean> => {
    const result = await userHelper.update(ScheduleModel, updates);
    return result.updated;
};

export const removeSchedule = async (scheduleId: string): Promise<void> => {
    await userHelper.remove(ScheduleModel, "scheduleId", scheduleId);
};
