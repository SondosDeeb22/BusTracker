"use strict";
//===================================================================================================
//? Importing
//===================================================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOsrmGeometry = exports.buildFinalStations = void 0;
const https_1 = __importDefault(require("https"));
//===================================================================================================
//===================================================================================================
//? helper to build final stations order (default start -> admin stations -> default end)
//===================================================================================================
const buildFinalStations = (adminStations, startStationIds, endStationIds) => {
    // create array of the admin stations 
    const cleaned = Array.isArray(adminStations)
        ? adminStations
            .map((station) => String(station))
            .map((station) => station.trim())
            .filter((station) => station.length > 0)
        : [];
    // middle is the admin stations' array (but it's checked that it doesn't has any campus stations)
    const middle = cleaned
        .filter((id) => !startStationIds.includes(id))
        .filter((id) => !endStationIds.includes(id));
    // compine start stations + admin statins + end station to form the final array of this route
    const finalStations = [
        ...startStationIds,
        ...middle,
        ...endStationIds,
    ];
    return Array.from(new Set(finalStations));
};
exports.buildFinalStations = buildFinalStations;
//===================================================================================================
//? helper to fetch road-following geometry from OSRM (public server)
//===================================================================================================
const fetchOsrmGeometry = async (coordinates) => {
    try {
        // ensure that provided data is array and length is more than or equals 2 
        if (!Array.isArray(coordinates) || coordinates.length < 2)
            return null;
        // OSRM expects: pair of longtitude and latitude seperated with semi column (lon,lat;lon,lat... )
        const coordStr = coordinates
            .map((coordinate) => `${coordinate.longitude},${coordinate.latitude}`)
            .join(';');
        const osrmBaseUrl = process.env.OSRM_BASE_URL?.trim() || 'https://router.project-osrm.org';
        const url = `${osrmBaseUrl}/route/v1/driving/${coordStr}?overview=full&geometries=geojson&steps=false&alternatives=true`;
        // fetch the road-following geometry from OSRM
        const raw = await new Promise((resolve, reject) => {
            https_1.default.get(url, (res) => {
                const chunks = [];
                //collects the response data from the OSRM server as it arrives in chunks, when response is finished, joins all chunks into one string and returns it
                res.on('data', (data) => chunks.push(Buffer.from(data)));
                res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
            }).on('error', reject);
        });
        // --------------------------------------------------------------------
        // parse the response and extract the road-following geometry
        const parsed = JSON.parse(raw);
        const routes = Array.isArray(parsed?.routes) ? parsed.routes : [];
        if (routes.length === 0)
            return null;
        // Heuristic: choose the "outer" route as the one with the greatest distance
        // (OSRM's default is usually the shortest/fastest, which can cut through inner roads.)
        const selected = routes.reduce((best, curr) => {
            const bestDist = Number(best?.distance ?? 0);
            const currDist = Number(curr?.distance ?? 0);
            return currDist > bestDist ? curr : best;
        }, routes[0]);
        const coords = selected?.geometry?.coordinates;
        if (!Array.isArray(coords) || coords.length === 0)
            return null;
        // geojson is [lon, lat]
        return coords
            .filter((point) => Array.isArray(point) && point.length >= 2)
            .map((point) => ({ latitude: Number(point[1]), longitude: Number(point[0]) }))
            .filter((point) => !Number.isNaN(point.latitude) && !Number.isNaN(point.longitude));
    }
    catch {
        return null;
    }
};
exports.fetchOsrmGeometry = fetchOsrmGeometry;
//# sourceMappingURL=routeHelper.js.map