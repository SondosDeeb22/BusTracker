//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';

//========================================================
//? Data model representing a station in a route (User Homepage)
//========================================================
@immutable
class UserRouteStationModel {
  final String id;
  final String stationName;

  const UserRouteStationModel({
    required this.id,
    required this.stationName,
  });

  //----------------------------------------------------------------------------------------
  factory UserRouteStationModel.fromJson(Map<String, dynamic> json) {
    return UserRouteStationModel(
      id: (json['id'] ?? '').toString(),
      stationName: (json['stationName'] ?? '').toString(),
    );
  }
}
