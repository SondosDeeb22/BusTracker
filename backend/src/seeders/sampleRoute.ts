//============================================================================================
// import Route table interface 
//============================================================================================

import { RouteAttributes } from "../interfaces/routeInterface";

//============================================================================================

const routes: Array<RouteAttributes> = [
  {
    id: "R001",
    title: "Campus - Nicosia",
    color: "#1613c3ff",
    totalStops: 8,
    status: "covered",
  },
  {
    id: "R002",
    title: "Campus - Kızılbaş",
    color: "#8B5CF6",
    totalStops: 8,
    status: "covered",
  },
  {
    id: "R003",
    title: "Campus - Gonyeli 1",
    color: "#ffa81dff",
    totalStops: 10,
    status: "covered",
  },
  {
    id: "R004",
    title: "Campus - Yenikent / Gönyeli",
    color: "#00c885b9",
    totalStops: 10,
    status: "covered",
  },
  {
    id: "R005",
    title: "Campus - Ortaköy / Yenikent",
    color: "#10b981",
    totalStops: 9,
    status: "covered",
  },
  {
    id: "R006",
    title: "Campus - Kyrenia",
    color: "#ef4444",
    totalStops: 12,
    status: "covered",
  },
  {
    id: "R007",
    title: "Kyrenia - Campus",
    color: "#f97316",
    totalStops: 12,
    status: "covered",
  },
  {
    id: "R008",
    title: "Campus - Güzelyurt",
    color: "#3b82f6",
    totalStops: 12,
    status: "covered",
  },
  {
    id: "R009",
    title: "Güzelyurt - Campus",
    color: "#6366f1",
    totalStops: 12,
    status: "covered",
  },
  {
    id: "R010",
    title: "Campus - Famagusta",
    color: "#eab308",
    totalStops: 14,
    status: "covered",
  },
  {
    id: "R011",
    title: "Famagusta – Campus",
    color: "#22d3ee",
    totalStops: 14,
    status: "covered",
  },
];

//============================================================================================
export default routes;
