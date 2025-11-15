//imporitng enums
import {status} from '../enums/busEnum';

export interface BusAttributes{
    id: string;
    serialNumber: string;
    brand: string;
    status: keyof typeof status;
    assignedRoute: string;
    assignedDriver: string;
}