//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';

import 'user_route_station_model.dart';

//========================================================
//? Data model representing a route with its stations (User Homepage)
//========================================================
@immutable
class UserRouteModel {
  final String id;
  final String title;
  final String color;
  final int? colorInt;
  final List<UserRouteStationModel> stations;

  const UserRouteModel({
    required this.id,
    required this.title,
    required this.color,
    required this.colorInt,
    required this.stations,
  });

  //----------------------------------------------------------------------------------------
  factory UserRouteModel.fromJson(Map<String, dynamic> json) {
    final rawColorInt = json['colorInt'];
    final parsedColorInt = rawColorInt is int
        ? rawColorInt
        : int.tryParse(rawColorInt?.toString() ?? '');

    final rawStations = json['stations'];
    final stations = rawStations is List
        ? rawStations
            .whereType<Map>()
            .map((s) =>
                UserRouteStationModel.fromJson(s.cast<String, dynamic>()))
            .where((s) => s.stationName.isNotEmpty)
            .toList(growable: false)
        : const <UserRouteStationModel>[];

    return UserRouteModel(
      id: (json['id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      color: (json['color'] ?? '').toString(),
      colorInt: parsedColorInt,
      stations: stations,
    );
  }
}
