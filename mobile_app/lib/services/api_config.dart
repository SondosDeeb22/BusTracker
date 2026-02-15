//==============================================================================
//? Importing
//==============================================================================
import 'dart:io';


// =============================================================================
//? API Configuration
// =============================================================================
class ApiConfig {
  static const String _apiBaseUrl = String.fromEnvironment('API_BASE_URL');

  static String get baseUrl {
    final overrideUrl = _apiBaseUrl.trim();
    if (overrideUrl.isNotEmpty) return overrideUrl;

    if (Platform.isAndroid) {
      return 'http://10.0.2.2:3001';
    }

    return 'http://localhost:3001';
  }
}
