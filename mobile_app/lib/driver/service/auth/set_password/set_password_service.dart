//========================================================
//? importing
//========================================================
import 'dart:convert';
import 'dart:io';

import '../../../model/auth/set_password/set_password_result.dart';
import '../../../../services/api_config.dart';

//========================================================
//? set password service
//========================================================

class SetPasswordService {
  final String _baseUrl;

  SetPasswordService({String? baseUrl}) : _baseUrl = baseUrl ?? _defaultBaseUrl();

  //========================================================

  static String _defaultBaseUrl() {
    return ApiConfig.baseUrl;
  }

  //========================================================

  Future<String?> validateSetPasswordToken({required String token}) async {
    final client = HttpClient();

    try {
      final uri = Uri.parse('$_baseUrl/api/auth/set-password/$token');

      final request = await client.headUrl(uri);
      request.headers.set(HttpHeaders.acceptHeader, 'application/json');

      final response = await request.close();
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return null;
      }

      final body = await response.transform(utf8.decoder).join();
      final decoded = _tryDecodeJson(body);
      final message = (decoded is Map<String, dynamic>)
          ? (decoded['message']?.toString() ?? '')
          : '';

      return message.isEmpty ? 'common.auth.invalidToken' : message;
    } catch (_) {
      return 'common.auth.invalidToken';
    } finally {
      client.close(force: true);
    }
  }

  //=========================================================================

  Future<SetPasswordResult> setPassword({
    required String token,
    required String newPassword,
    required String confirmPassword,
  }) async {
    final client = HttpClient();

    try {
      final uri = Uri.parse('$_baseUrl/api/auth/set-password/$token');
      final request = await client.patchUrl(uri);

      request.headers.set(HttpHeaders.acceptHeader, 'application/json');
      request.headers.set(HttpHeaders.contentTypeHeader, 'application/json');

      final payload = <String, String>{
        'newPassword': newPassword,
        'confirmPassword': confirmPassword,
      };

      request.add(utf8.encode(jsonEncode(payload)));

      final response = await request.close();
      final body = await response.transform(utf8.decoder).join();

      final decoded = _tryDecodeJson(body);
      final message = (decoded is Map<String, dynamic>)
          ? (decoded['message']?.toString() ?? '')
          : '';

      if (response.statusCode < 200 || response.statusCode >= 300) {
        return SetPasswordResult.failure(message.isEmpty ? 'Request failed' : message);
      }

      return SetPasswordResult.success(
        message.isEmpty ? 'Password set successful' : message,
      );
    } catch (error) {
      return SetPasswordResult.failure('Set password failed: $error');
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
