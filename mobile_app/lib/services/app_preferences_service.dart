//========================================================
//? importing
//========================================================
import 'package:shared_preferences/shared_preferences.dart';

//========================================================

//? Service for managing app preferences stored locally
//? this service is shared between the user app and driver app
//========================================================

class AppPreferencesService {
  final String _scope;

  // Singleton instances per scope ------------------------------------------------
  static final Map<String, AppPreferencesService> _instances = {};

  factory AppPreferencesService({required String scope}) {
    final cleaned = scope.trim().isEmpty ? 'app' : scope.trim();
    return _instances.putIfAbsent(
      cleaned,
      () => AppPreferencesService._internal(cleaned),
    );
  }

  AppPreferencesService._internal(this._scope);

  //========================================================================================

  String get _languageKey => '${_scope}_language';
  String get _appearanceKey => '${_scope}_appearance';

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

  // ==========================================================================

  // Clear all preferences for this scope (useful for testing or reset)
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
