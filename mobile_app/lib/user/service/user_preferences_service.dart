//========================================================
//? importing
//========================================================
import 'package:shared_preferences/shared_preferences.dart';

//========================================================

//? Service for managing user preferences stored locally
//? Persists language and appearance settings without requiring login
//========================================================

class UserPreferencesService {
  static const String _languageKey = 'user_language';
  static const String _appearanceKey = 'user_appearance';

  // Singleton instance
  static final UserPreferencesService _instance =
      UserPreferencesService._internal();
  factory UserPreferencesService() => _instance;
  UserPreferencesService._internal();

  // Save language preference -----------------------------------------------------
  // 'en' for English, 'tr' for Turkish
  Future<void> saveLanguage(String languageCode) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_languageKey, languageCode);
    } catch (e) {
      //? Handle storage errors gracefully
      throw Exception('Failed to save language preference: $e');
    }
  }

  // Get saved language preference -----------------------------------------------------
  // Returns 'en' as default if no preference is saved
  Future<String> getLanguage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_languageKey) ?? 'en';
    } catch (e) {
      return 'en';
    }
  }

  //========================================================================================

  // Save appearance preference
  // 'light' or 'dark'
  Future<void> saveAppearance(String appearance) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_appearanceKey, appearance);
    } catch (e) {
      throw Exception('Failed to save appearance preference: $e');
    }
  }

  // -----------------------------------------------------
  // Get saved appearance preference
  //? Returns 'light' as default if no preference is saved
  Future<String> getAppearance() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_appearanceKey) ?? 'light';
    } catch (e) {
      //? Return default appearance on error
      return 'light';
    }
  }

  // ===========================================================================

  // Check if English is selected
  Future<bool> isEnglishSelected() async {
    final language = await getLanguage();
    return language == 'en';
  }

  // -----------------------------------------------------

  // Check if light theme is selected
  Future<bool> isLightSelected() async {
    final appearance = await getAppearance();
    return appearance == 'light';
  }

  // ===========================================================================

  // Clear all user preferences (useful for testing or reset)
  Future<void> clearAllPreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_languageKey);
      await prefs.remove(_appearanceKey);
    } catch (e) {
      throw Exception('Failed to clear preferences: $e');
    }
  }
}
