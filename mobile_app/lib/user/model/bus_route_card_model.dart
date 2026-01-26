//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//========================================================

class BusRouteCardModel {
  final String name;
  final Color color;
  final bool hasLocation;

  const BusRouteCardModel({
    required this.name,
    required this.color,
    required this.hasLocation,
  });
}
