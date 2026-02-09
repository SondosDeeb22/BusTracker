//========================================================
//? importing
//========================================================
import 'dart:convert';
import 'dart:io';

import '../auth/login/login_service.dart';
import '../../model/profile/driver_profile_models.dart';

//========================================================
//? service
//========================================================

class DriverProfileService {
  final String _baseUrl;

  DriverProfileService({String? baseUrl}) : _baseUrl = baseUrl ?? _defaultBaseUrl();

  //========================================================

  static String _defaultBaseUrl() {
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:3001';
    }
    return 'http://localhost:3001';
  }

  //========================================================
  // get the profile data 
  Future<DriverProfileModel?> fetchProfile() async {
    final client = HttpClient();

    try {
      final uri = Uri.parse('$_baseUrl/api/driver/profile');

      final request = await client.getUrl(uri);
      request.headers.set(HttpHeaders.acceptHeader, 'application/json');

      final cookie = await LoginService.getStoredAuthCookie();
      if (cookie != null && cookie.trim().isNotEmpty) {
        request.headers.set(HttpHeaders.cookieHeader, cookie);
      }

      final response = await request.close();
      final body = await response.transform(utf8.decoder).join();

      final decoded = _tryDecodeJson(body);

      if (response.statusCode < 200 || response.statusCode >= 300) {
        return null;
      }

      final data = (decoded is Map<String, dynamic>) ? decoded['data'] : null;
      if (data is! Map<String, dynamic>) {
        return null;
      }

      return DriverProfileModel.fromJson(data);
    } finally {
      client.close(force: true);
    }
  }

  //========================================================
  // update the driver phone number 
  Future<bool> updatePhone({required String phone}) async {
    final client = HttpClient();

    try {
      final uri = Uri.parse('$_baseUrl/api/driver/update');

      final request = await client.patchUrl(uri);
      request.headers.set(HttpHeaders.acceptHeader, 'application/json');
      request.headers.set(HttpHeaders.contentTypeHeader, 'application/json');

      final cookie = await LoginService.getStoredAuthCookie();
      if (cookie != null && cookie.trim().isNotEmpty) {
        request.headers.set(HttpHeaders.cookieHeader, cookie);
      }

      final payload = <String, String>{
        'phone': phone.trim(),
      };

      request.add(utf8.encode(jsonEncode(payload)));

      final response = await request.close();

      if (response.statusCode < 200 || response.statusCode >= 300) {
        return false;
      }

      return true;
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
}
