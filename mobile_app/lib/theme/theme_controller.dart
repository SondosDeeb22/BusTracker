// =========================================================================
//? Importing
// =========================================================================
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'app_theme.dart';




// =========================================================================
//? Theme Controller
// =========================================================================
class ThemeController extends ChangeNotifier {
  static const String _themeKey = 'selected_theme';
  static ThemeMode _themeMode = ThemeMode.light;

  static final ThemeController _instance = ThemeController._internal();
  factory ThemeController() => _instance;
  ThemeController._internal();

  Future<void> init() async {
    await _loadSavedTheme();
  }
 
  // ===========================================================================
  // Load saved theme 
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
      _themeMode = ThemeMode.light;
    }
  }

  // ===========================================================================
  // Change theme 
  Future<void> changeTheme(String theme) async {
    if (theme == 'dark') {
      _themeMode = ThemeMode.dark;
    } else {
      _themeMode = ThemeMode.light;
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_themeKey, theme);
    } catch (e) {
      // ignore
    }

    notifyListeners();
  }

  ThemeMode get themeMode => _themeMode;
  bool get isLight => _themeMode == ThemeMode.light;
  bool get isDark => _themeMode == ThemeMode.dark;

  ThemeData get lightTheme => AppTheme.light();
  ThemeData get darkTheme => AppTheme.dark();
}
