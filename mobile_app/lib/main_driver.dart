//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import 'driver/screen/auth/login/login_page.dart';

//========================================================

void main() {
  runApp(const DriverApp());
}

//========================================================

class DriverApp extends StatelessWidget {
  const DriverApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NEU Bus Tracker - Driver',
      home: const LoginPage(),
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF59011A)),
      ),
    );
  }
}
