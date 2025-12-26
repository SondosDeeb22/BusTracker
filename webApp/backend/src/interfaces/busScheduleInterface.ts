import {weekDays, shiftType} from "../enums/busScheduleEnum";    


//==============================
//? bus Schedule Attributes
//==============================

export interface BusScheduleAttributes{
    id:string,
    date:Date,
    day: keyof typeof weekDays,
    shiftType: keyof typeof shiftType,
    driverId: string,
    busId: string,
    routeId: string,
    createdAt: Date,
    createdBy: string,
    updatedAt?: Date,
    updatedBy?: string,
}