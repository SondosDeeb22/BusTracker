//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';

import 'route_geometry_point_model.dart';
import 'route_station_point_model.dart';

//========================================================
//? Data model representing a route map payload (User)
//========================================================
@immutable
class RouteMapModel {
  final String id;
  final String title;
  final String color;
  final int? colorInt;
  final List<RouteStationPointModel> points;
  final List<RouteGeometryPointModel> geometry;

  const RouteMapModel({
    required this.id,
    required this.title,
    required this.color,
    required this.colorInt,
    required this.points,
    required this.geometry,
  });

  //----------------------------------------------------------------------------------------
  // get color integer from json (if found)
  factory RouteMapModel.fromJson(Map<String, dynamic> json) {
    final rawColorInt = json['colorInt'];
    final parsedColorInt = rawColorInt is int
        ? rawColorInt
        : int.tryParse(rawColorInt?.toString() ?? '');

    // parse points --------------------------------------------------------------
    final rawPoints = json['points'];
    final points = rawPoints is List
        ? rawPoints
            .whereType<Map>()
            .map((point) => RouteStationPointModel.fromJson(point.cast<String, dynamic>())) // convert each point to RouteStationPointModel
            .where((point) => point.stationName.isNotEmpty) // filter out empty station names
            .toList(growable: false) // convert to list
        : const <RouteStationPointModel>[];

    // parse geometry ----------------------------------------------------------------
    final rawGeometry = json['geometry'];
    final geometry = rawGeometry is List
        ? rawGeometry
            .whereType<Map>()
            .map((point) => RouteGeometryPointModel.fromJson(point.cast<String, dynamic>()))
            .toList(growable: false)
        : const <RouteGeometryPointModel>[];

    //-----------------------------------------------------------------------------
    return RouteMapModel(
      id: (json['id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      color: (json['color'] ?? '').toString(),
      colorInt: parsedColorInt,
      points: points,
      geometry: geometry,
    );
  }
}
