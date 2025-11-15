//============================================================================================
// import Route table interface 
//============================================================================================

import { RouteAttributes } from "../interfaces/routeInterface";

//============================================================================================

const routes: Array<RouteAttributes> = [
  {
    id: "R001",
    title: "Lefkoşa",
    totalStops: 3,
    status: "covered",
  },
  {
    id: "R002",
    title: "Gönyeli",
    totalStops: 4,
    status: "unassigned",
  },
  {
    id: "R003",
    title: "Girne",
    totalStops: 2,
    status: "covered",
  },
  {
    id: "R004",
    title: "Gazimağusa",
    totalStops: 3,
    status: "covered",
  },
];

//============================================================================================
export default routes;
