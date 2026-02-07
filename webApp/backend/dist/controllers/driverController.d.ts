import { Request, Response } from 'express';
export declare class DriverController {
    addDriver(req: Request, res: Response): Promise<void>;
    removeDriver(req: Request, res: Response): Promise<void>;
    updateDriver(req: Request, res: Response): Promise<void>;
    fetchAllDrivers(req: Request, res: Response): Promise<void>;
    fetchDriverSchedule(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=driverController.d.ts.map