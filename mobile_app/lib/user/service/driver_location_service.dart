//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';
import 'package:geolocator/geolocator.dart';

//========================================================
//? service for getting driver live location updates
//========================================================

class DriverLocationService {
  // Singleton instance
  static final DriverLocationService _instance = DriverLocationService._internal();
  factory DriverLocationService() => _instance;
  DriverLocationService._internal();

  //==================================================================================

  // get specific location updates using "geolocator"
  Stream<Position> getPositionStream({
    int distanceFilterMeters = 10,
    Duration androidInterval = const Duration(seconds: 3),
    LocationAccuracy accuracy = LocationAccuracy.high,
  }) {
    final LocationSettings locationSettings;

    if (defaultTargetPlatform == TargetPlatform.android) {
      locationSettings = AndroidSettings(
        accuracy: accuracy,
        distanceFilter: distanceFilterMeters,
        intervalDuration: androidInterval,
      );
    } else {
      locationSettings = LocationSettings(
        accuracy: accuracy,
        distanceFilter: distanceFilterMeters,
      );
    }

    return Geolocator.getPositionStream(locationSettings: locationSettings);
  }
}
