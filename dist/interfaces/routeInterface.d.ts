import { status } from '../enums/routeEnum';
export interface RouteAttributes {
    id: string;
    title: string;
    totalStops: number;
    status: keyof typeof status;
}
//# sourceMappingURL=routeInterface.d.ts.map