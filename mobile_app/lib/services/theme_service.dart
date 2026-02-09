//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/theme_controller.dart';

//========================================================

//? Service for managing app themes and appearance
//? Supports light and dark themes with custom colors
//========================================================

class ThemeService extends ChangeNotifier {
  // App color constants
  static const Color burgundy = AppColors.burgundy;
  static const Color lightBg = AppColors.lightBg;
  static const Color border = AppColors.border;
  static const Color darkBg = AppColors.darkBg;
  static const Color darkSurface = AppColors.darkSurface;

  final ThemeController _controller = ThemeController();

  // Singleton instance
  static final ThemeService _instance = ThemeService._internal();
  factory ThemeService() => _instance;
  ThemeService._internal() {
    _controller.addListener(notifyListeners);
  }

  // Initialize the theme service
  Future<void> init() async {
    await _controller.init();
  }

  // =========================================================
  //? Change theme and save preference
  // =========================================================
  Future<void> changeTheme(String theme) async {
    await _controller.changeTheme(theme);
  }

//===================================================================
  // Get current theme mode
  ThemeMode get themeMode => _controller.themeMode;

  // Check if current theme is light
  bool get isLight => _controller.isLight;

  // Check if current theme is dark
  bool get isDark => _controller.isDark;

// =========================================================
  // Get light theme data
  ThemeData get lightTheme {
    return _controller.lightTheme;
  }

  // Get dark theme data
  ThemeData get darkTheme {
    return _controller.darkTheme;
  }
}
