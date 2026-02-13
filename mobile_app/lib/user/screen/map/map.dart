//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart' as flutterMap;
import 'package:latlong2/latlong.dart' as ll;

import '../../../services/localization_service.dart';

// contoller
import '../../controller/driver_map_controller.dart';

// widget
import '../../widget/map/coordinates_box.dart';
import '../../widget/map/driver_marker_layer.dart';

//========================================================


class DriverMapScreen extends StatefulWidget {
  const DriverMapScreen({super.key});

  @override
  State<DriverMapScreen> createState() => _DriverMapScreenState();
}


// ------------


class _DriverMapScreenState extends State<DriverMapScreen> {
  final flutterMap.MapController _mapController = flutterMap.MapController();

  late final DriverMapController _controller;

  bool _loading = true;
  String? _errorMessage;
  ll.LatLng? _initialLocation;

  double _currentZoom = 16;

  // ---------------------------------------------------
  @override
  void initState() {
    super.initState();

    _controller = DriverMapController();
    _controller.addListener(_onControllerChanged);
    _controller.driverLocationNotifier.addListener(_onDriverLocationChanged);
    _controller.init();
  }

  @override
  void dispose() {
    _controller.driverLocationNotifier.removeListener(_onDriverLocationChanged);
    _controller.removeListener(_onControllerChanged);
    _controller.dispose();
    super.dispose();
  }

  // =========================================================================
  // 
  void _onControllerChanged() {
    if (!mounted) return;

    setState(() {
      _loading = _controller.loading;
      _errorMessage = _controller.error;
      _initialLocation = _controller.initialLocation;
    });
  }

  void _onDriverLocationChanged() {
    final current = _controller.driverLocationNotifier.value;
    if (current == null) return;
    if (_loading || _errorMessage != null) return;
    _mapController.move(current, _currentZoom);
  }

  // =========================================================================

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    // --------------------------------------------------------
    if (_errorMessage != null) {
      return Scaffold(
        appBar: AppBar(title: Text('navigation.map'.tr)),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              _errorMessage!,
              textAlign: TextAlign.center,
            ),
          ),
        ),
      );
    }

    // --------------------------------------------------------
    final initialLocation = _initialLocation;

    if (initialLocation == null) {
      return Scaffold(
        body: Center(
          child: Text('map.noLocationAvailable'.tr),
        ),
      );
    }

    // display the map ---------------------------------------------------
    return Scaffold(
      appBar: AppBar(title: Text('navigation.map'.tr)),

      body: Stack(
        children: [
          flutterMap.FlutterMap(
            mapController: _mapController,

            options: flutterMap.MapOptions(
              initialCenter: initialLocation,
              initialZoom: 16,
              onPositionChanged: (position, hasGesture) {
                _currentZoom = position.zoom;
              },
            ),

            children: [
              // ----------------------------------------------------
              // display map tiles
              flutterMap.TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.example.mobile_app',
              ),

              // ----------------------------------------------------
              // display driver marker 
              ValueListenableBuilder<ll.LatLng?>(
                valueListenable: _controller.driverLocationNotifier,
                builder: (context, location, child) {
                  if (location == null) return const SizedBox.shrink();                
                  return DriverMarkerLayer(location: location);
                },
              ),
            ],
          ),

          // --------------------------------------------------------------------
          // create white box to display coordinates(latitude and longitude) 
          ValueListenableBuilder<ll.LatLng?>(
            valueListenable: _controller.driverLocationNotifier,
            builder: (context, location, child) {
              if (location == null) return const SizedBox.shrink();
              return CoordinatesBox(location: location);
            },
          ),
        ],
      ),
      //========================================================
    );
  }
}
