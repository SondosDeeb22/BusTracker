//============================================================================================
import 'package:flutter/material.dart';
import 'src/screens/user/coverPageUser.dart';

//============================================================================================
void main() {
  runApp(const MyApp());
}

//============================================================================================

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NEU Bus Tracker',
      home: const CoverPage(),

      debugShowCheckedModeBanner: false,

      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF59011A)),
      ),
    );
  }
}
