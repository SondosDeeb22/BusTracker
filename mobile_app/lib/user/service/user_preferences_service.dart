//========================================================
//? importing
//========================================================
import '../../services/app_preferences_service.dart';

//========================================================

//? Service for managing user preferences stored locally
//? Persists language and appearance settings without requiring login
//========================================================

class UserPreferencesService {
  final AppPreferencesService _prefs = AppPreferencesService(scope: 'user');

  // Singleton instance
  static final UserPreferencesService _instance =
      UserPreferencesService._internal();
  factory UserPreferencesService() => _instance;
  UserPreferencesService._internal();

  // Save language preference -----------------------------------------------------
  // 'en' for English, 'tr' for Turkish
  Future<void> saveLanguage(String languageCode) async {
    await _prefs.saveLanguage(languageCode);
  }

  // Get saved language preference -----------------------------------------------------
  // Returns 'en' as default if no preference is saved
  Future<String> getLanguage() async {
    return _prefs.getLanguage();
  }

  //========================================================================================

  // Save appearance preference
  // 'light' or 'dark'
  Future<void> saveAppearance(String appearance) async {
    await _prefs.saveAppearance(appearance);
  }

  // -----------------------------------------------------
  // Get saved appearance preference
  //? Returns 'light' as default if no preference is saved
  Future<String> getAppearance() async {
    return _prefs.getAppearance();
  }

  // ===========================================================================

  // Check if English is selected
  Future<bool> isEnglishSelected() async {
    return _prefs.isEnglishSelected();
  }

  // -----------------------------------------------------

  // Check if light theme is selected
  Future<bool> isLightSelected() async {
    return _prefs.isLightSelected();
  }

  // ===========================================================================

  // Clear all user preferences (useful for testing or reset)
  Future<void> clearAllPreferences() async {
    await _prefs.clearAllPreferences();
  }
}
