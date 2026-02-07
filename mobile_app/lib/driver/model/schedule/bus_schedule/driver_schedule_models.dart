//========================================================
//? models
//========================================================

import 'package:flutter/material.dart';

import '../../../controller/route_color_parser.dart';

class DriverScheduleTrip {
  final String time;
  final String routeName;
  final Color routeColor;
  final String busId;
  final String busPlate;

  const DriverScheduleTrip({
    required this.time,
    required this.routeName,
    required this.routeColor,
    required this.busId,
    required this.busPlate,
  });

  factory DriverScheduleTrip.fromJson(Map<String, dynamic> json) {
    return DriverScheduleTrip(
      time: (json['time'] ?? '').toString(),
      routeName: (json['routeName'] ?? '').toString(),
      routeColor: parseRouteColor((json['routeColor'] ?? '').toString()),
      busId: (json['busId'] ?? '').toString(),
      busPlate: (json['busPlate'] ?? '').toString(),
    );
  }
}

// ----------------------------------------------------------

class DriverScheduleDay {
  final String date;
  final String day;
  final String driverId;
  final List<DriverScheduleTrip> scheduleDetails;

  const DriverScheduleDay({
    required this.date,
    required this.day,
    required this.driverId,
    required this.scheduleDetails,
  });

  factory DriverScheduleDay.fromJson(Map<String, dynamic> json) {
    final detailsRaw = json['scheduleDetails'];
    final List<DriverScheduleTrip> details = detailsRaw is List<dynamic>
        ? detailsRaw
              .whereType<Map<String, dynamic>>()
              .map(DriverScheduleTrip.fromJson)
              .toList()
        : <DriverScheduleTrip>[];

    return DriverScheduleDay(
      date: (json['date'] ?? '').toString(),
      day: (json['day'] ?? '').toString(),
      driverId: (json['driverId'] ?? '').toString(),
      scheduleDetails: details,
    );
  }
}
