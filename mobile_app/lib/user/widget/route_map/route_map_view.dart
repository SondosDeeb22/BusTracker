//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../model/map/route_map_model.dart';
import 'station_marker.dart';
//========================================================
//? Route Map View Widget
//========================================================
class RouteMapView extends StatelessWidget {
  final RouteMapModel route;
  final Color routeColor;

  const RouteMapView({
    super.key,
    required this.route,
    required this.routeColor,
  });

  @override
  Widget build(BuildContext context) {
    final polylinePoints = route.geometry.isNotEmpty
        ? route.geometry
              .map((point) => LatLng(point.latitude, point.longitude))
              .toList(growable: false)
        : route.points
              .map((point) => LatLng(point.latitude, point.longitude))
              .toList(growable: false);

    final center = polylinePoints.isNotEmpty
        ? polylinePoints.first
        : const LatLng(35.22976464271693, 33.32470132280108);

    return FlutterMap(
      options: MapOptions(
        initialCenter: center,
        initialZoom: 12,
        interactionOptions: const InteractionOptions(
          flags: InteractiveFlag.pinchZoom | InteractiveFlag.drag,
        ),
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.example.mobile_app',
        ),
        PolylineLayer(
          polylines: [
            Polyline(
              points: polylinePoints,
              strokeWidth: 5,
              color: routeColor.withOpacity(0.85),
            ),
          ],
        ),
        MarkerLayer(
          markers: [
            for (int i = 0; i < route.points.length; i++)
              Marker(
                point: LatLng(
                  route.points[i].latitude,
                  route.points[i].longitude,
                ),
                width: 44,
                height: 44,
                child: StationMarker(number: i + 1),
              ),
          ],
        ),
      ],
    );
  }
}
