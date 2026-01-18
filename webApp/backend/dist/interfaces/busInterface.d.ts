import { status } from '../enums/busEnum';
export interface BusAttributes {
    id: string;
    plate: string;
    brand: string;
    status: keyof typeof status;
    assignedRoute: string;
    assignedDriver: string;
}
//# sourceMappingURL=busInterface.d.ts.map