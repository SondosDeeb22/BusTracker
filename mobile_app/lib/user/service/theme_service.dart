//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import 'user_preferences_service.dart';

//========================================================

//? Service for managing app theme based on user preferences
//? Provides light and dark themes with app-specific colors
//========================================================

class ThemeService {
  static const _burgundy = Color(0xFF59011A);
  static const _bg = Color(0xFFF2F1ED);
  static const _border = Color(0xFFC9A47A);

  //===============================================================================================================
  // Get light theme
  //===============================================================================================================
  static ThemeData getLightTheme() {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: _burgundy,
        brightness: Brightness.light,
      ),
      
      scaffoldBackgroundColor: _bg,

      appBarTheme: const AppBarTheme(
        backgroundColor: _burgundy,
        foregroundColor: _bg,
        elevation: 0,
        centerTitle: true,
      ),

      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: _burgundy,
          foregroundColor: _bg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),

      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: _border.withOpacity(0.3)),
        ),
      ),

      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: _border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: _burgundy, width: 2),
        ),
      ),

    );
  }

  //===============================================================================================================
  // Get dark theme
  //===============================================================================================================

  static ThemeData getDarkTheme() {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: _burgundy,
        brightness: Brightness.dark,
      ),

      scaffoldBackgroundColor: const Color(0xFF121212),

      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF1E1E1E),
        foregroundColor: _bg,
        elevation: 0,
        centerTitle: true,
      ),

      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: _burgundy,
          foregroundColor: _bg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),

      cardTheme: CardThemeData(
        color: const Color(0xFF1E1E1E),
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: Colors.grey.withOpacity(0.3)),
        ),
      ),

      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: _burgundy, width: 2),
        ),
      ),

    );
  }

  //===============================================================================================================
  // Get theme based on saved preference
  //===============================================================================================================

  static Future<ThemeData> getTheme() async {
    final prefsService = UserPreferencesService();
    final appearance = await prefsService.getAppearance();
    return appearance == 'dark' ? getDarkTheme() : getLightTheme();
  }
}
