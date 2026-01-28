//========================================================
//? importing
//========================================================
import 'dart:convert';
import 'dart:io';

import '../../../model/auth/forgot_password/forgot_password_result.dart';

//========================================================
//? forgot password service
//========================================================

class ForgotPasswordService {
  final String _baseUrl;

  ForgotPasswordService({String? baseUrl})
    : _baseUrl = baseUrl ?? _defaultBaseUrl();

  //========================================================

  static String _defaultBaseUrl() {
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:3001';
    }
    return 'http://localhost:3001';
  }

  //========================================================

  Future<ForgotPasswordResult> sendResetEmail({required String email}) async {
    final trimmedEmail = email.trim();

    final client = HttpClient();

    try {
      final uri = Uri.parse('$_baseUrl/api/auth/driver/forgot-password');
      final request = await client.postUrl(uri);

      request.headers.set(HttpHeaders.acceptHeader, 'application/json');
      request.headers.set(HttpHeaders.contentTypeHeader, 'application/json');

      final payload = <String, String>{'email': trimmedEmail};

      request.add(utf8.encode(jsonEncode(payload)));

      final response = await request.close();
      final body = await response.transform(utf8.decoder).join();

      final decoded = _tryDecodeJson(body);
      final message = (decoded is Map<String, dynamic>)
          ? (decoded['message']?.toString() ?? '')
          : '';

      if (response.statusCode < 200 || response.statusCode >= 300) {
        return ForgotPasswordResult.failure(
          message.isEmpty ? 'Request failed' : message,
        );
      }

      return ForgotPasswordResult.success(
        message.isEmpty ? 'Password reset email sent' : message,
      );

      //----------------------------------------------------------
    } catch (error) {
      return ForgotPasswordResult.failure('Forgot password failed: $error');

      //----------------------------------------------------------
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
