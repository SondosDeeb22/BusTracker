type CreateRouteStationInput = {
    routeId: string;
    stationId: string;
    orderIndex: number;
};
export declare class RouteStationService {
    private generateNextRouteStationId;
    createOne(input: CreateRouteStationInput): Promise<void>;
    createMany(inputs: CreateRouteStationInput[]): Promise<void>;
}
export {};
//# sourceMappingURL=routeStationService.d.ts.map