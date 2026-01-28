//========================================================
//? importing
//========================================================

//========================================================

//? data models for user bus schedule screen
//========================================================

import 'package:flutter/material.dart';

class BusScheduleDayModel {
  final String dayKey;
  final String date;
  final List<BusScheduleServicePatternModel> servicePatterns;

  const BusScheduleDayModel({
    required this.dayKey,
    required this.date,
    required this.servicePatterns,
  });
}

//========================================================

class BusScheduleServicePatternModel {
  final String servicePatternId;
  final String title;
  final List<String> operatingTimes;
  final List<BusScheduleRouteModel> routes;

  const BusScheduleServicePatternModel({
    required this.servicePatternId,
    required this.title,
    required this.operatingTimes,
    required this.routes,
  });
}

//========================================================
class BusScheduleRouteModel {
  final String routeName;
  final Color tabColorValue;
  final List<String> departureTimes;

  const BusScheduleRouteModel({
    required this.routeName,
    required this.tabColorValue,
    required this.departureTimes,
  });
}
