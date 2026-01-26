//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

//========================================================

//? Service for managing app themes and appearance
//? Supports light and dark themes with custom colors
//========================================================

class ThemeService extends ChangeNotifier {
  static const String _themeKey = 'selected_theme';
  static ThemeMode _themeMode = ThemeMode.light;

  // App color constants
  static const Color burgundy = Color(0xFF59011A);
  static const Color lightBg = Color(0xFFF2F1ED);
  static const Color border = Color(0xFFC9A47A);
  static const Color darkBg = Color(0xFF1A1A1A);
  static const Color darkSurface = Color(0xFF2D2D2D);

  // Singleton instance
  static final ThemeService _instance = ThemeService._internal();
  factory ThemeService() => _instance;
  ThemeService._internal();

  // Initialize the theme service
  Future<void> init() async {
    await _loadSavedTheme();
  }

  // ==============================================================
  //? Load saved theme preference
  // ==============================================================
  Future<void> _loadSavedTheme() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final themeString = prefs.getString(_themeKey);
      if (themeString == 'dark') {
        _themeMode = ThemeMode.dark;
      } else {
        _themeMode = ThemeMode.light;
      }
    } catch (e) {
      print('Error loading theme preference: $e');
      _themeMode = ThemeMode.light; // Fallback to light theme
    }
  }

  // =========================================================
  //? Change theme and save preference
  // =========================================================
  Future<void> changeTheme(String theme) async {
    if (theme == 'dark') {
      _themeMode = ThemeMode.dark;
    } else {
      _themeMode = ThemeMode.light;
    }

    // Save theme preference
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_themeKey, theme);
    } catch (e) {
      print('Warning: Failed to save theme preference: $e');
      // Continue anyway - user can still use the app with the new theme
      // Next app launch will use default theme if save failed
    }

    // Notify listeners for real-time updates
    print('ThemeService: Notifying listeners of theme change to $theme');
    notifyListeners();
  }

//===================================================================
  // Get current theme mode
  ThemeMode get themeMode => _themeMode;

  // Check if current theme is light
  bool get isLight => _themeMode == ThemeMode.light;

  // Check if current theme is dark
  bool get isDark => _themeMode == ThemeMode.dark;

// =========================================================
  // Get light theme data
  ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: burgundy,
      scaffoldBackgroundColor: lightBg,
      colorScheme: const ColorScheme.light(
        primary: burgundy,
        secondary: border,
        surface: Colors.white,
        background: lightBg,
        error: Colors.red,
        onPrimary: Colors.white,
        onSecondary: Colors.black,
        onSurface: Colors.black,
        onBackground: Colors.black,
        onError: Colors.white,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: burgundy,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: burgundy,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: burgundy,
        contentTextStyle: const TextStyle(color: Colors.white),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // Get dark theme data
  ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: burgundy,
      scaffoldBackgroundColor: darkBg,
      colorScheme: const ColorScheme.dark(
        primary: burgundy,
        secondary: border,
        surface: darkSurface,
        background: darkBg,
        error: Colors.red,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: Colors.white,
        onBackground: Colors.white,
        onError: Colors.white,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: burgundy,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: burgundy,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),
      cardTheme: CardThemeData(
        color: darkSurface,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: burgundy,
        contentTextStyle: const TextStyle(color: Colors.white),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
