//========================================================
//? importing
//========================================================
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

//========================================================

//? Driver-only localization service
//========================================================

class DriverLocalizationService extends ChangeNotifier {
  static const String _languageKey = 'driver_selected_language';
  static const String _assetRoot = 'lib/driver/languages';
  static const List<String> _translationFiles = [
    'auth/login.json',
    'auth/forgot_password.json',
    'auth/reset_password.json',
  ];

  static Map<String, dynamic>? _translations;
  static String _currentLanguage = 'en';

  // Singleton instance
  static final DriverLocalizationService _instance =
      DriverLocalizationService._internal();

  factory DriverLocalizationService() => _instance;
  DriverLocalizationService._internal();

  // ============================================================
  // initialize
  Future<void> init() async {
    await _loadSavedLanguage();
    await _loadTranslations();
  }

  //========================================================

  Future<void> _loadSavedLanguage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _currentLanguage = prefs.getString(_languageKey) ?? 'en';
    } catch (_) {
      _currentLanguage = 'en';
    }
  }

  //========================================================

  Future<void> _loadTranslations() async {
    _translations = {};

    for (final file in _translationFiles) {
      try {
        final jsonString = await rootBundle.loadString(
          '$_assetRoot/$_currentLanguage/$file',
        );
        final Map<String, dynamic> fileTranslations = json.decode(jsonString);
        _translations!.addAll(fileTranslations);
      } catch (_) {
        try {
          final jsonString = await rootBundle.loadString(
            '$_assetRoot/en/$file',
          );
          final Map<String, dynamic> fileTranslations = json.decode(jsonString);
          _translations!.addAll(fileTranslations);
        } catch (_) {
          continue;
        }
      }
    }
  }

  //==================================================================================

  Future<void> changeLanguage(String languageCode) async {
    if (languageCode == _currentLanguage) return;

    _currentLanguage = languageCode;
    await _loadTranslations();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_languageKey, languageCode);
    } catch (_) {
      // ignore
    }

    notifyListeners();
  }

  //==================================================================================
  String get currentLanguage => _currentLanguage;

  String translate(String key) {
    if (_translations == null) return key;

    if (_translations!.containsKey(key)) {
      return _translations![key].toString();
    }

    final keys = key.split('.');
    dynamic value = _translations;

    for (final k in keys) {
      if (value is Map<String, dynamic> && value.containsKey(k)) {
        value = value[k];
      } else {
        return key;
      }
    }

    return value.toString();
  }

  bool get isEnglish => _currentLanguage == 'en';
  bool get isTurkish => _currentLanguage == 'tr';
}

//==================================================================================

// extension that adds a getter called "translate" to all Strings, so we don't expose localization logic everywhere
extension DriverTranslations on String {
  String get translate => DriverLocalizationService().translate(this);
}
