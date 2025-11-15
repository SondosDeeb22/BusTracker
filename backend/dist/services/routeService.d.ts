import { Request, Response } from 'express';
export declare class RouteService {
    addRoute(req: Request, res: Response): Promise<void>;
    removeRoute(req: Request, res: Response): Promise<void>;
    updateRoute(req: Request, res: Response): Promise<void>;
    viewRoutes(req: Request, res: Response, displayAll: boolean): Promise<void>;
}
//# sourceMappingURL=routeService.d.ts.map