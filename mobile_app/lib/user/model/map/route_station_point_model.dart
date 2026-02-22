//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';

//========================================================
//? Data model representing a station (stop) point on the route map (User)
//========================================================
@immutable
class RouteStationPointModel {
  final String stationId;
  final String stationName;
  final double latitude;
  final double longitude;
  final int orderIndex;

  const RouteStationPointModel({
    required this.stationId,
    required this.stationName,
    required this.latitude,
    required this.longitude,
    required this.orderIndex,
  });

  //----------------------------------------------------------------------------------------
  factory RouteStationPointModel.fromJson(Map<String, dynamic> json) {
    final rawLat = json['latitude'];
    final rawLng = json['longitude'];

    final lat = rawLat is num ? rawLat.toDouble() : double.tryParse(rawLat?.toString() ?? '') ?? 0;
    final lng = rawLng is num ? rawLng.toDouble() : double.tryParse(rawLng?.toString() ?? '') ?? 0;

    final rawOrder = json['orderIndex'];
    final order = rawOrder is int ? rawOrder : int.tryParse(rawOrder?.toString() ?? '') ?? 0;

    return RouteStationPointModel(
      stationId: (json['stationId'] ?? '').toString(),
      stationName: (json['stationName'] ?? '').toString(),
      latitude: lat,
      longitude: lng,
      orderIndex: order,
    );
  }
}
