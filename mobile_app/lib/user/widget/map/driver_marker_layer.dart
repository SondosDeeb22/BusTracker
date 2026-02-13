//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart' as flutterMap;
import 'package:latlong2/latlong.dart' as ll;

//========================================================

class DriverMarkerLayer extends StatelessWidget {
  final ll.LatLng location;

  const DriverMarkerLayer({
    super.key,
    required this.location,
  });

  // build marker layer
  @override
  Widget build(BuildContext context) {
    return flutterMap.MarkerLayer(
      markers: [
        flutterMap.Marker(
          point: location,
          width: 50,
          height: 50,
          child: const Icon(
            Icons.location_pin,
            color: Colors.red,
            size: 40,
          ),
        ),
      ],
    );
  }
}
