//========================================================
//? importing
//========================================================
import 'dart:convert';
import 'dart:io';

import '../../../model/auth/reset_password/reset_password_result.dart';

//========================================================
//? reset password service
//========================================================

class ResetPasswordService {
  final String _baseUrl;

  ResetPasswordService({String? baseUrl})
    : _baseUrl = baseUrl ?? _defaultBaseUrl();

  //========================================================

  static String _defaultBaseUrl() {
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:3001';
    }
    return 'http://localhost:3001';
  }

  //========================================================

  Future<ResetPasswordResult> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    final client = HttpClient();

    try {
      final uri = Uri.parse('$_baseUrl/api/auth/reset-password/$token');
      final request = await client.patchUrl(uri);

      request.headers.set(HttpHeaders.acceptHeader, 'application/json');
      request.headers.set(HttpHeaders.contentTypeHeader, 'application/json');

      final payload = <String, String>{
        'newPassword': newPassword,
      };

      request.add(utf8.encode(jsonEncode(payload)));

      final response = await request.close();
      final body = await response.transform(utf8.decoder).join();

      final decoded = _tryDecodeJson(body);
      final message = (decoded is Map<String, dynamic>)
          ? (decoded['message']?.toString() ?? '')
          : '';

      if (response.statusCode < 200 || response.statusCode >= 300) {
        return ResetPasswordResult.failure(
          message.isEmpty ? 'Request failed' : message,
        );
      }

      return ResetPasswordResult.success(
        message.isEmpty ? 'Password reset successful' : message,
      );
     
    // ----------------------------------------------------------------
    } catch (error) {
      return ResetPasswordResult.failure('Reset password failed: $error');
      
    // ----------------------------------------------------------------
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
