//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//========================================================

class StationMarker extends StatelessWidget {
  final int number;

  const StationMarker({required this.number});

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 255, 255, 255),
        shape: BoxShape.circle,
        border: Border.all(color: Colors.black.withOpacity(0.35), width: 2),
      ),
      child: Text(
        number.toString(),
        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
      ),
    );
  }
}
