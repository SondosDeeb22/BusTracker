//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart' as ll;

//========================================================

class CoordinatesBox extends StatelessWidget {
  final ll.LatLng location;

  const CoordinatesBox({
    super.key,
    required this.location,
  });

  // build coordinates box 
  @override
  Widget build(BuildContext context) {
    return Positioned(
      left: 12,
      top: 12,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.92),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: 10,
            vertical: 8,
          ),
          child: Text(
            '${location.latitude.toStringAsFixed(6)}, ${location.longitude.toStringAsFixed(6)}',
          ),
        ),
      ),
    );
  }
}
