//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//========================================================

Color parseRouteColor(String hexColor) {
  var cleaned = hexColor.trim();
  if (cleaned.startsWith('#')) {
    cleaned = cleaned.substring(1);
  }

  if (cleaned.length == 6) {
    cleaned = 'FF$cleaned';
  } else if (cleaned.length == 8) {
    final rgba = cleaned;
    cleaned = '${rgba.substring(6, 8)}${rgba.substring(0, 6)}';
  } else {
    return const Color(0xFF9E9E9E);
  }

  final value = int.tryParse(cleaned, radix: 16);
  if (value == null) {
    return const Color(0xFF9E9E9E);
  }
  return Color(value);
}
