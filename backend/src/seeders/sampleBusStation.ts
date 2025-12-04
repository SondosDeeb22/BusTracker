//============================================================================================
// import BusStation table interface 
//============================================================================================

import { stationAttributes } from "../interfaces/stationInterface";

//============================================================================================

const stations: Array<stationAttributes> = [
  {
    id: "S001",
    stationName: "Central Station",
    latitude:  35.1885,
    longitude: 33.3692,
    status: "covered",
  },
  {
    id: "S002",
    stationName: "Airport Terminal",
    latitude:  35.1585,
    longitude: 33.4265,
    status: "covered",
  },
  {
    id: "S003",
    stationName: "Harbor Pier",
    latitude:  35.1865,
    longitude: 33.3658,
    status: "notCovered",
  },
  {
    id: "S004",
    stationName: "University Gate",
    latitude:  35.1885,
    longitude: 33.3692,
    status: "covered",
  },
  {
    id: "S005",
    stationName: "North Park",
    latitude: 35.1952,
    longitude: 33.3728,
    status: "covered",
  },
  {
    id: "S006",
    stationName: "East Mall",
    latitude: 35.1825,
    longitude: 33.3852,
    status: "covered",
  },
  {
    id: "S007",
    stationName: "Tech Park",
    latitude: 35.1928,
    longitude: 33.3615,
    status: "covered",
  },
  {
    id: "S008",
    stationName: "Old Town",
    latitude: 35.1752,
    longitude: 33.3825,
    status: "covered",
  },
  {
    id: "S009",
    stationName: "Harbor Side",
    latitude: 35.1885,
    longitude: 33.3652,
    status: "covered",
  },
  {
    id: "S010",
    stationName: "City Gate",
    latitude: 35.2005,
    longitude: 33.3758,
    status: "covered",
  },
  {
    id: "S011",
    stationName: "West End",
    latitude: 35.1728,
    longitude: 33.3585,
    status: "covered",
  },
  {
    id: "S012",
    stationName: "South Gate",
    latitude: 35.1652,
    longitude: 33.3925,
    status: "covered",
  },
]

//============================================================================================
export default stations;
