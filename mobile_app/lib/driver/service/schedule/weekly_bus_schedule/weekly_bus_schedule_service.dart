//========================================================
//? importing
//========================================================
import 'dart:convert';
import 'dart:io';

import '../../auth/login/login_service.dart';
import '../../../model/schedule/weekly_bus_schedule/driver_weekly_schedule_models.dart';

//========================================================
//? service
//========================================================

class DriverWeeklyBusScheduleService {
  final String _baseUrl;

  DriverWeeklyBusScheduleService({String? baseUrl})
      : _baseUrl = baseUrl ?? _defaultBaseUrl();

  //========================================================

  static String _defaultBaseUrl() {
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:3001';
    }
    return 'http://localhost:3001';
  }

  //========================================================

  Future<List<DriverWeeklyScheduleDay>> fetchWeeklySchedule({
    String? driverId,
  }) async {
    final client = HttpClient();

    try {
      final uri = Uri.parse('$_baseUrl/api/driver/schedule/fetch')
          .replace(queryParameters: {
        if (driverId != null && driverId.trim().isNotEmpty)
          'driverId': driverId.trim(),
      });

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
        return <DriverWeeklyScheduleDay>[];
      }

      final data = (decoded is Map<String, dynamic>) ? decoded['data'] : null;
      if (data is! List<dynamic>) {
        return <DriverWeeklyScheduleDay>[];
      }

      return data
          .whereType<Map<String, dynamic>>()
          .map(DriverWeeklyScheduleDay.fromJson)
          .toList();
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
