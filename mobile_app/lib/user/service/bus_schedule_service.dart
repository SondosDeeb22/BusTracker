//========================================================
//? importing
//========================================================
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';

import '../model/bus_schedule_model.dart';
import '../../services/app_constants.dart';

//========================================================
//? service for getting user bus schedules
//========================================================

class BusScheduleService {
  // Singleton instance
  static final BusScheduleService _instance = BusScheduleService._internal();
  factory BusScheduleService() => _instance;
  BusScheduleService._internal({String? baseUrl})
    : _baseUrl = baseUrl ?? _defaultBaseUrl();

  final String _baseUrl;

  // Default base URL for the API
  static String _defaultBaseUrl() {
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:3001';
    }
    return 'http://localhost:3001';
  }

  //===================================================================

  // get bus schedule --------------------------------------------
  Future<List<BusScheduleDayModel>> fetchUserBusSchedule({
    String? loginToken,
    DateTime? date,
    DateTime? fromDate,
    DateTime? toDate,
    String? servicePatternId,
  }) async {
    final queryParams = <String, String>{};
    if (date != null) {
      queryParams['date'] = _formatDate(date);
    }
    if (fromDate != null) {
      queryParams['fromDate'] = _formatDate(fromDate);
    }
    if (toDate != null) {
      queryParams['toDate'] = _formatDate(toDate);
    }
    if (servicePatternId != null && servicePatternId.trim().isNotEmpty) {
      queryParams['servicePatternId'] = servicePatternId.trim();
    }

    final uri = Uri.parse(
      '$_baseUrl/api/user/schedule/fetch',
    ).replace(queryParameters: queryParams.isEmpty ? null : queryParams);

    final client = HttpClient(); // HTTP client for making the request

    try {
      final request = await client.getUrl(
        uri,
      ); // perform GET request on the url we defined

      request.headers.set(HttpHeaders.acceptHeader, 'application/json');

      if (loginToken != null && loginToken.trim().isNotEmpty) {
        request.headers.set(
          HttpHeaders.authorizationHeader,
          'Bearer ${loginToken.trim()}',
        );
      }

      final response = await request.close();
      final body = await response.transform(utf8.decoder).join();

      //check that we have no error( no status code between 200 and 299)
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw Exception('Request failed (${response.statusCode}): $body');
      }

      final decoded = jsonDecode(body);
      final data = (decoded is Map<String, dynamic>) ? decoded['data'] : null;
      if (data is! List) {
        return const [];
      }

      return _mapGroupedApiToUiDays(data);
    } finally {
      client.close(force: true);
    }
  }
  // ================================================================================================================

  // get grouped data from the endpoint and map it to UI model
  List<BusScheduleDayModel> _mapGroupedApiToUiDays(List rawList) {
    final result = <BusScheduleDayModel>[];

    for (final raw in rawList) {
      if (raw is! Map) continue;
      final map = raw.cast<String, dynamic>();

      final dayKey = (map['dayKey'] ?? '').toString();
      final date = (map['date'] ?? '').toString();

      final servicePatternsRaw = map['servicePatterns'];
      final servicePatterns = <BusScheduleServicePatternModel>[];
      if (servicePatternsRaw is List) {
        for (final spRaw in servicePatternsRaw) {
          if (spRaw is! Map) continue;
          final spMap = spRaw.cast<String, dynamic>();

          final spId = (spMap['servicePatternId'] ?? '').toString();
          final title = (spMap['title'] ?? '').toString();

          final operatingTimesRaw = spMap['operatingTimes'];
          final operatingTimes = <String>[];
          if (operatingTimesRaw is List) {
            for (final t in operatingTimesRaw) {
              final s = (t ?? '').toString();
              if (s.trim().isEmpty) continue;
              operatingTimes.add(s);
            }
          }

          final routesRaw = spMap['routes'];
          final routes = <BusScheduleRouteModel>[];
          if (routesRaw is List) {
            for (final rRaw in routesRaw) {
              if (rRaw is! Map) continue;
              final rMap = rRaw.cast<String, dynamic>();

              final routeName = (rMap['routeName'] ?? '').toString();
              final tabColorValue = _colorFromApiValue(rMap['tabColorValue']);

              final departureTimesRaw = rMap['departureTimes'];
              final departureTimes = <String>[];
              if (departureTimesRaw is List) {
                for (final dt in departureTimesRaw) {
                  final s = (dt ?? '').toString();
                  if (s.trim().isEmpty) continue;
                  departureTimes.add(s);
                }
              }

              routes.add(
                BusScheduleRouteModel(
                  routeName: routeName,
                  tabColorValue: tabColorValue,
                  departureTimes: departureTimes,
                ),
              );
            }
          }

          servicePatterns.add(
            BusScheduleServicePatternModel(
              servicePatternId: spId,
              title: title,
              operatingTimes: (operatingTimes..sort()),
              routes: routes,
            ),
          );
        }
      }

      result.add(
        BusScheduleDayModel(
          dayKey: dayKey,
          date: date,
          servicePatterns: servicePatterns,
        ),
      );
    }

    return result;
  }

  //========================================================================

  // convert color from API value
  Color _colorFromApiValue(dynamic value) {
    if (value is int) {
      return Color(value);
    }

    final parsed = int.tryParse((value ?? '').toString());
    if (parsed != null) {
      return Color(parsed);
    }
    return kDefaultRouteColor;
  }

  // -------------------------------------
  // format date to YYYY-MM-DD
  String _formatDate(DateTime d) {
    String two(int v) => v.toString().padLeft(2, '0');
    return '${d.year}-${two(d.month)}-${two(d.day)}';
  }
}
