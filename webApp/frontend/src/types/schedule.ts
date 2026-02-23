// ======================================================================================
//? Types - Schedule
// ======================================================================================

export type ScheduleTrip = {
  detailedScheduleId: string;
  scheduleId: string;
  time: string;
  routeId: string;
  driverId: string;
  busId: string;
  route?: { id: string; title: string; color?: string };
  driver?: { id: string; name: string };
  bus?: { id: string; plate: string; brand?: string; status?: string };
};

export type ScheduleTimelineRow = {
  time: string;
  trips: ScheduleTrip[];
};

export type ScheduleRouteRow = {
  id: string;
  title: string;
  color?: string;
};

export type ScheduleResponseRow = {
  scheduleId: string;
  date: string;
  day: string;
  servicePatternId: string;
  servicePattern?: {
    servicePatternId: string;
    title: string;
    operatingHours?: Array<{ operatingHourId: string; hour: string }>;
  };
  timeline: ScheduleTimelineRow[];
  otherTrips: ScheduleTrip[];
};

export type SelectedCell = {
  scheduleId: string;
  time: string;
  routeId: string;
  routeTitle?: string;
};
