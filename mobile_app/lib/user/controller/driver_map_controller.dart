//========================================================
//? importing
//========================================================
import 'dart:async';

import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart' as ll;
import 'package:flutter/foundation.dart';

import '../../services/localization_service.dart';

import '../service/driver_location_service.dart';

//========================================================
//? controller for driver map screen
//========================================================

class DriverMapController {
  final DriverLocationService _locationService;

  StreamSubscription<Position>? _positionSubscription;

  final ValueNotifier<ll.LatLng?> driverLocationNotifier =
      ValueNotifier<ll.LatLng?>(null);

  ll.LatLng? _initialLocation;
  bool _loading = true;
  String? _error;

  // notify listeners -----------------------------------------------------
  final List<VoidCallback> _listeners = [];

  DriverMapController({DriverLocationService? locationService})
    : _locationService = locationService ?? DriverLocationService();

  //==================================================================================

  bool get loading => _loading;
  String? get error => _error;
  ll.LatLng? get initialLocation => _initialLocation;

  //==================================================================================

  void addListener(VoidCallback listener) {
    _listeners.add(listener);
  }

  void removeListener(VoidCallback listener) {
    _listeners.remove(listener);
  }

 
  // notify listeners ------------------
  void _notify() {
    for (final listener in List<VoidCallback>.from(_listeners)) {
      listener();
    }
  }

  //==================================================================================

  // init controller ------------------
  Future<void> init() async {
    _loading = true;
    _error = null;
    _notify(); // add new listener to the list

    try {
      
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        _loading = false;
        _error = 'map.locationServicesDisabled'.tr;
        _notify();
        return;
      }

      // check location permission -----------------------------------------

      LocationPermission permission = await Geolocator.checkPermission();

      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      if (permission == LocationPermission.denied) {
        _loading = false;
        _error = 'map.locationPermissionDenied'.tr;
        _notify();
        return;
      }

      if (permission == LocationPermission.deniedForever) {
        _loading = false;
        _error = 'map.locationPermissionDeniedForever'.tr;
        _notify();
        return;
      }

      await startLocationStream();
    // ---------------------------------------------------------------------
    } catch (e) {
      _loading = false;
      _error = '${'map.failedToGetLocation'.tr}: $e';
      _notify();
    }
  }

  //==================================================================================

  // start location stream -----------------------
  Future<void> startLocationStream() async {
    await _positionSubscription?.cancel(); // It stops any existing location tracking before starting a new one

    // get location updates
    _positionSubscription = _locationService.getPositionStream(
      distanceFilterMeters: 10,
      androidInterval: const Duration(seconds: 3),
      accuracy: LocationAccuracy.high,
    ).listen(
      (position) async {

        // check if the location is mocked, if so, cancel the subscription
        if (position.isMocked) {
          await _positionSubscription?.cancel();
          _positionSubscription = null;

          _loading = false;
          _error = 'map.mockLocationDetected'.tr;
          _notify();
          return;
        }

        // convert position to LatLng( latitude and longitude)
        final current = ll.LatLng(position.latitude, position.longitude);
        driverLocationNotifier.value = current;

        if (_initialLocation == null) {
          _initialLocation = current;
          _notify();
        }

        if (_loading || _error != null) {
          _loading = false;
          _error = null;
          _notify();
        }
      },
      // -------------------------------------------------------------------
      onError: (error) {
        _loading = false;
        _error = '${'map.failedToGetLocation'.tr}: $error';
        _notify();
      },
    );
  }

  //==================================================================================
  // dispose controller 
  void dispose() {
    _positionSubscription?.cancel();
    driverLocationNotifier.dispose();
    _listeners.clear();
  }
}
