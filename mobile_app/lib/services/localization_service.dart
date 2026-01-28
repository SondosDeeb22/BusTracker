//========================================================
//? importing
//========================================================
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

//========================================================

//? Service for managing app localization and translations
//? Supports English and Turkish languages
//========================================================

class LocalizationService extends ChangeNotifier {
  static const String _languageKey = 'selected_language';
  static String _assetRoot = 'lib/user/languages';
  static List<String> _translationFiles = const [
    'common.json',
    'navigation.json',
    'cover_page.json',
    'homepage.json',
    'account_settings.json',
    'bus_schedule.json',
    'messages.json',
  ];
  static Map<String, dynamic>? _translations;
  static String _currentLanguage = 'en';

  // Singleton instance
  static final LocalizationService _instance = LocalizationService._internal();
  factory LocalizationService() => _instance;
  LocalizationService._internal();

  // Initialize the localization service
  Future<void> init() async {
    await _loadSavedLanguage();
    await _loadTranslations();
  }

  //========================================================

  void setAssetRoot(String assetRoot) {
    _assetRoot = assetRoot.trim().isEmpty
        ? 'lib/user/languages'
        : assetRoot.trim();
  }

  //========================================================

  void setTranslationFiles(List<String> files) {
    final cleaned = files
        .map((f) => f.trim())
        .where((f) => f.isNotEmpty)
        .toList(growable: false);
    if (cleaned.isEmpty) return;
    _translationFiles = cleaned;
  }

  // Load saved language preference
  Future<void> _loadSavedLanguage() async {
    try {
      // reads 'selected_language' from SharedPreferences, if not fouund we use 'en' as default
      final prefs = await SharedPreferences.getInstance();
      _currentLanguage = prefs.getString(_languageKey) ?? 'en';
    } catch (e) {
      print('Error loading language preference: $e');
      _currentLanguage = 'en'; // Fallback to English
    }
  }

  // ====================================================
  //? Load translation files
  // ====================================================
  Future<void> _loadTranslations() async {
    try {
      _translations = {};

      // List of translation files to load
      final files = _translationFiles;

      // Load each file and merge translations
      for (final file in files) {
        try {
          final String jsonString = await rootBundle.loadString(
            '$_assetRoot/$_currentLanguage/$file',
          );
          final Map<String, dynamic> fileTranslations = json.decode(jsonString);
          _translations!.addAll(fileTranslations);
        } catch (e) {
          // If file not found in current language, try English fallback
          try {
            final String jsonString = await rootBundle.loadString(
              '$_assetRoot/en/$file',
            );
            final Map<String, dynamic> fileTranslations = json.decode(
              jsonString,
            );
            _translations!.addAll(fileTranslations);
          } catch (fallbackError) {
            // If even fallback fails, continue with other files
            continue;
          }
        }
      }
    } catch (e) {
      // If everything fails, initialize empty translations
      _translations = {};
    }
  }

  //==================================================================================
  //? Change language and reload translations
  //==================================================================================
  Future<void> changeLanguage(String languageCode) async {
    if (languageCode != _currentLanguage) {
      _currentLanguage = languageCode;
      await _loadTranslations();

      // Save language preference
      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_languageKey, languageCode);
      } catch (e) {
        print('Warning: Failed to save language preference: $e');
        // Continue anyway - user can still use the app with the new language
        // Next app launch will use default language if save failed
      }

      // Notify listeners for real-time updates
      notifyListeners();
    }
  }

  // Get current language code
  String get currentLanguage => _currentLanguage;

  // Get translated text by key
  String translate(String key) {
    if (_translations == null) return key;

    final keys = key.split('.');
    dynamic value = _translations;

    for (final k in keys) {
      if (value is Map<String, dynamic> && value.containsKey(k)) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return value.toString();
  }

  // Check if current language is English
  bool get isEnglish => _currentLanguage == 'en';

  // Check if current language is Turkish
  bool get isTurkish => _currentLanguage == 'tr';
}

//==================================================================================

// Extension for easy access to translations
extension Translations on String {
  String get tr => LocalizationService().translate(this);
}
