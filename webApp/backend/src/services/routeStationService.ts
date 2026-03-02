//===================================================================================================
//? Importing
//===================================================================================================
import RouteStationModel from "../models/routeStationModel";

//===================================================================================================
//? Types
//===================================================================================================
type CreateRouteStationInput = {
    routeId: string;
    stationId: string;
    orderIndex: number;
};

//===================================================================================================
//? Service
//===================================================================================================
export class RouteStationService {
    //===================================================================================================
    //? Generate Route Station Id
    //===================================================================================================
    private async generateNextRouteStationId(): Promise<string> {
        const last = await RouteStationModel.findOne({
            attributes: ["routeStationId"],
            order: [["routeStationId", "DESC"]],
        });

        const lastId = typeof (last as any)?.routeStationId === "string" ? String((last as any).routeStationId).trim() : "";
        const lastN = /^RS(\d{4})$/.test(lastId) ? Number(lastId.slice(2)) : 0;

        for (let n = Math.max(1, lastN + 1); n <= 9999; n++) {
            const candidate = `RS${String(n).padStart(4, "0")}`;

            const exists = await RouteStationModel.findOne({
                where: { routeStationId: candidate } as any,
                attributes: ["routeStationId"],
            });

            if (!exists) return candidate;
        }

        throw new Error("routeStationId space exhausted");
    }

    //===================================================================================================
    //? Create Route Station
    //===================================================================================================
    async createOne(input: CreateRouteStationInput): Promise<void> {
        const routeStationId = await this.generateNextRouteStationId();

        await RouteStationModel.create({
            routeStationId,
            routeId: input.routeId,
            stationId: input.stationId,
            orderIndex: input.orderIndex,
        } as any);
    }

    //===================================================================================================
    //? Create Many Route Stations
    //===================================================================================================
    async createMany(inputs: CreateRouteStationInput[]): Promise<void> {
        for (const row of inputs) {
            await this.createOne(row);
        }
    }
}
