// import enums

import {status} from '../enums/routeEnum';

export interface RouteAttributes{
    id: string;
    title: string;
    // stopStations: string[];
    totalStops: number;
    status: keyof typeof status;
    // assignedBuses: string[];
}
