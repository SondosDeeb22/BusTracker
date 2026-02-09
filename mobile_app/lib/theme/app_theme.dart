import 'package:flutter/material.dart';

import 'app_colors.dart';

class AppTheme {

  // =========================================================================
  //? Light theme
  // =========================================================================
  static ThemeData light() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: AppColors.burgundy,
      scaffoldBackgroundColor: AppColors.lightBg,

      // Color Scheme -----------------------------------------------
      colorScheme: const ColorScheme.light(

        primary: AppColors.burgundy,
        onPrimary: AppColors.white,

        secondary: AppColors.border,
        onSecondary: AppColors.black,


        surface: AppColors.white,
        onSurface: AppColors.black,
        surfaceTint: AppColors.lightSurfaceTint,


        background: AppColors.lightBg,
        onBackground: AppColors.black,


        error: AppColors.errorRed,
        onError: AppColors.white,  
        
      ),

      // AppBar theme -----------------------------------------------
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.burgundy,
        foregroundColor: AppColors.white,
        elevation: 0,
        centerTitle: true,
      ),

      // Elevated button theme -----------------------------------------------
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.burgundy,
          foregroundColor: AppColors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),

      // Card theme -----------------------------------------------
      cardTheme: CardThemeData(
        color: AppColors.white,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),

      // SnackBar theme -----------------------------------------------
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.burgundy,
        contentTextStyle: const TextStyle(color: AppColors.white),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // =========================================================================
  //? Dark theme
  // =========================================================================
  static ThemeData dark() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: AppColors.burgundy,
      scaffoldBackgroundColor: AppColors.darkBg,

      // Color scheme -----------------------------------------------
      colorScheme: const ColorScheme.dark(
        
        // button background
        primary: AppColors.burgundy,
        // text/icon drawn on it
        onPrimary: AppColors.white,

        // toggles
        secondary: AppColors.border,
        onSecondary: AppColors.white,
        
        // card, sheet, dialog background
        surface: AppColors.darkSurface,
        onSurface: AppColors.white,

        background: AppColors.darkBg,
        onBackground: AppColors.white,

        error: AppColors.errorRed,
        onError: AppColors.white,

      ),

      // AppBar theme -----------------------------------------------
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.burgundy,
        foregroundColor: AppColors.white,
        elevation: 0,
        centerTitle: true,
      ),

      // Elevated button theme -----------------------------------------------
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.burgundy,
          foregroundColor: AppColors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),

      // Card theme -----------------------------------------------
      cardTheme: CardThemeData(
        color: AppColors.darkSurface,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),

      // SnackBar theme -----------------------------------------------
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.burgundy,
        contentTextStyle: const TextStyle(color: AppColors.white),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
