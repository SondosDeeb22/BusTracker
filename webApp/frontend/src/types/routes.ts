// ======================================================================================
//? Types - Routes
// ======================================================================================

export type RouteStationRef = {
  id?: string;
  stationId?: string;
  stationName?: string;
  name?: string;
};

export type RouteRow = {
  id: string;
  title?: string;
  stations?: RouteStationRef[];
};
