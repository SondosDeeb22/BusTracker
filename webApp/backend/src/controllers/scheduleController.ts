//============================================================================================================================================================
//?importing 
//============================================================================================================================================================
import { Request, Response } from 'express';

import { ScheduleService } from '../services/scheduleService';
const scheduleService = new ScheduleService();

//============================================================================================================================================================
//? Class
//============================================================================================================================================================

export class ScheduleController {
    async getSchedule(req: Request, res: Response) {
        return scheduleService.getSchedule(req, res);
    }

    async getUserSchedule(req: Request, res: Response) {
        return scheduleService.getUserSchedule(req, res);
    }

    async addSchedule(req: Request, res: Response) {
        return scheduleService.addSchedule(req, res);
    }

    async updateSchedule(req: Request, res: Response) {
        return scheduleService.updateSchedule(req, res);
    }

    async removeSchedule(req: Request, res: Response) {
        return scheduleService.removeSchedule(req, res);
    }

    //===================================================================================================
    //? Scheduled Trips
    //===================================================================================================
    
    async addScheduledTrip(req: Request, res: Response) {
        return scheduleService.addScheduledTrip(req, res);
    }

    async removeScheduledTrip(req: Request, res: Response) {
        return scheduleService.removeScheduledTrip(req, res);
    }



}
