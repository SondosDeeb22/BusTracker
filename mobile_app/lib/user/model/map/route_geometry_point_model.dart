//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';

//========================================================
//? Data model representing a geometry point on the route polyline (User)
//========================================================
@immutable
class RouteGeometryPointModel {
  final double latitude;
  final double longitude;

  const RouteGeometryPointModel({
    required this.latitude,
    required this.longitude,
  });

  //----------------------------------------------------------------------------------------
  factory RouteGeometryPointModel.fromJson(Map<String, dynamic> json) {
    final rawLat = json['latitude'];
    final rawLng = json['longitude'];

    final lat = rawLat is num ? rawLat.toDouble() : double.tryParse(rawLat?.toString() ?? '') ?? 0;
    final lng = rawLng is num ? rawLng.toDouble() : double.tryParse(rawLng?.toString() ?? '') ?? 0;

    return RouteGeometryPointModel(
      latitude: lat,
      longitude: lng,
    );
  }
}
