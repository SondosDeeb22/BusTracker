//========================================================
//? importing
//========================================================
import 'dart:convert';
import 'dart:io';

import 'package:shared_preferences/shared_preferences.dart';

import '../../../model/auth/login/login_result.dart';
import '../../../../services/api_config.dart';

//========================================================
//? login service
//========================================================

class LoginService {
  static const String _authCookieKey = 'auth_cookie';

  final String _baseUrl;

  LoginService({String? baseUrl}) : _baseUrl = baseUrl ?? _defaultBaseUrl();

  //========================================================

  static String _defaultBaseUrl() {
    return ApiConfig.baseUrl;
  }

  // ----------------------------------------------------------

  static Future<String?> getStoredAuthCookie() async {
    final prefs = await SharedPreferences.getInstance();
    final cookie = prefs.getString(_authCookieKey);
    if (cookie == null || cookie.trim().isEmpty) return null;
    return cookie;
  }
  //========================================================

  Future<LoginResult> login({
    required String email,
    required String password,
  }) async {
    final client = HttpClient();

    try {
      final uri = Uri.parse('$_baseUrl/api/auth/login');
      final request = await client.postUrl(uri);

      request.headers.set(HttpHeaders.acceptHeader, 'application/json');
      request.headers.set(HttpHeaders.contentTypeHeader, 'application/json');

      final payload = <String, String>{
        'email': email.trim(),
        'password': password,
      };

      request.add(utf8.encode(jsonEncode(payload)));

      final response = await request.close();
      final body = await response.transform(utf8.decoder).join();

      final decoded = _tryDecodeJson(body);
      final message = (decoded is Map<String, dynamic>)
          ? (decoded['message']?.toString() ?? '')
          : '';

      // if status code is not 2xx, return failure
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return LoginResult.failure(message.isEmpty ? 'Login failed' : message);
      }

      //-------------------------------------------------------------------

      // get cookie header from response
      final setCookieHeaders = response.headers[HttpHeaders.setCookieHeader];
      final cookieHeader = _extractCookieHeader(setCookieHeaders);

      // if cookie header is not null and not empty, save it
      if (cookieHeader != null && cookieHeader.trim().isNotEmpty) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_authCookieKey, cookieHeader);
      }

      return LoginResult.success(message);
      //---------------------------------------------------------------------
    } catch (error) {
      return LoginResult.failure('Login failed: $error');
      //---------------------------------------------------------------------
    } finally {
      client.close(force: true);
    }
  }

  //========================================================

  static dynamic _tryDecodeJson(String body) {
    try {
      return jsonDecode(body);
    } catch (_) {
      return null;
    }
  }

  // -------------------------------------------------------------------------
  // function to extract cookie header
  static String? _extractCookieHeader(List<String>? setCookieHeaders) {
    if (setCookieHeaders == null || setCookieHeaders.isEmpty) return null;

    final cookiePairs = <String>[];
    for (final raw in setCookieHeaders) {
      final parts = raw.split(';');

      if (parts.isEmpty) continue;

      final pair = parts.first.trim();

      if (pair.isEmpty) continue;

      cookiePairs.add(pair);
    }

    if (cookiePairs.isEmpty) return null;

    return cookiePairs.join('; ');
  }
}
