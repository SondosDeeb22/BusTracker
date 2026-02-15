//========================================================
//? importing
//========================================================
import 'dart:io';

import 'package:shared_preferences/shared_preferences.dart';

import '../../../service/auth/login/login_service.dart';
import 'package:flutter/foundation.dart';
import '../../../../services/api_config.dart';

//========================================================
//? logout service
//========================================================

class LogoutService {
  final String _baseUrl;

  LogoutService({String? baseUrl}) : _baseUrl = baseUrl ?? _defaultBaseUrl();

  //========================================================

  static String _defaultBaseUrl() {
    return ApiConfig.baseUrl;
  }

  // ----------------------------------------------------------

  //========================================================
  //? logout the user
  //========================================================

  Future<bool> logout() async {
    final client = HttpClient();

    try {
      final authCookie = await LoginService.getStoredAuthCookie();

      final uri = Uri.parse('$_baseUrl/api/auth/logout');
      final request = await client.getUrl(uri);

      request.headers.set(HttpHeaders.acceptHeader, 'application/json');
      request.headers.set(HttpHeaders.cookieHeader, authCookie ?? '');

      await request.close();

      // clear stored auth cookie regardless of response
      await _clearAuthCookie();

      // return true - user is logged out once cookie is cleared
      return true;

      // -------------------------------------------------------------------
    } catch (_) {
      // clear cookie even on error
      await _clearAuthCookie();
      // still return true - cookie is cleared so user is logged out
      return true;

      // -------------------------------------------------------------------
    } finally {
      client.close(force: true);
    }
  }

  //========================================================
  //? clear the stored auth cookie
  //========================================================

  Future<void> _clearAuthCookie() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('auth_cookie');
    } catch (error) {
       debugPrint('Warning: Failed to clear auth cookie: $error');
    }
  }
}
