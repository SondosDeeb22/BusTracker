//========================================================
//? models
//========================================================

import 'package:flutter/material.dart';

import '../../../../services/app_constants.dart';

// Driver weekly scheduel TRIP ----------------------------------------
class DriverWeeklyScheduleTrip {
  final String time;
  final String routeName;
  final Color routeColor;
  final String busId;
  final String busPlate;

  const DriverWeeklyScheduleTrip({
    required this.time,
    required this.routeName,
    required this.routeColor,
    required this.busId,
    required this.busPlate,
  });

  factory DriverWeeklyScheduleTrip.fromJson(Map<String, dynamic> json) {
    final routeColorInt = json['routeColorInt'];
    final int parsedRouteColorInt = routeColorInt is int
        ? routeColorInt
        : int.tryParse(routeColorInt?.toString() ?? '') ?? kDefaultRouteColorInt;

    return DriverWeeklyScheduleTrip(
      time: (json['time'] ?? '').toString(),
      routeName: (json['routeName'] ?? '').toString(),
      routeColor: Color(parsedRouteColorInt),
      busId: (json['busId'] ?? '').toString(),
      busPlate: (json['busPlate'] ?? '').toString(),
    );
  }
}

// Driver weekly scheduel DAY ----------------------------------------

class DriverWeeklyScheduleDay {
  final String date;
  final String day;
  final String driverId;
  final List<DriverWeeklyScheduleTrip> scheduleDetails;

  const DriverWeeklyScheduleDay({
    required this.date,
    required this.day,
    required this.driverId,
    required this.scheduleDetails,
  });

  factory DriverWeeklyScheduleDay.fromJson(Map<String, dynamic> json) {
    final detailsRaw = json['scheduleDetails'];
    final List<DriverWeeklyScheduleTrip> details = detailsRaw is List<dynamic>
        ? detailsRaw
              .whereType<Map<String, dynamic>>()
              .map(DriverWeeklyScheduleTrip.fromJson)
              .toList()
        : <DriverWeeklyScheduleTrip>[];

    return DriverWeeklyScheduleDay(
      date: (json['date'] ?? '').toString(),
      day: (json['day'] ?? '').toString(),
      driverId: (json['driverId'] ?? '').toString(),
      scheduleDetails: details,
    );
  }
}
