//========================================================
//? importing
//========================================================
import '../../services/app_preferences_service.dart';

//========================================================

//? Driver app wrapper for shared preferences
//? Keeps a stable API for the driver layer
//========================================================

class UserPreferencesService {
  static final UserPreferencesService _instance =
      UserPreferencesService._internal();
  factory UserPreferencesService() => _instance;
  UserPreferencesService._internal();

  final AppPreferencesService _prefs = AppPreferencesService(scope: 'driver');

  //========================================================================================

  Future<void> saveLanguage(String languageCode) => _prefs.saveLanguage(languageCode);

  Future<String> getLanguage() => _prefs.getLanguage();

  Future<void> saveAppearance(String appearance) => _prefs.saveAppearance(appearance);

  Future<String> getAppearance() => _prefs.getAppearance();

  Future<bool> isEnglishSelected() => _prefs.isEnglishSelected();

  Future<bool> isLightSelected() => _prefs.isLightSelected();

  Future<void> clearAllPreferences() => _prefs.clearAllPreferences();
}
