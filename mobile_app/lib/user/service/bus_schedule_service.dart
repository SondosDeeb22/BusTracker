//========================================================
//? importing
//========================================================
import 'dart:convert';
import 'dart:io';

import '../model/bus_schedule_model.dart';
import '../controller/route_color_parser.dart';

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

      return _mapApiSchedulesToUiDays(data);
    } finally {
      client.close(force: true);
    }
  }
  // ================================================================================================================

  // ======================================================================================
  //? Private helper method that maps API schedules to UI day models
  // ======================================================================================
  List<BusScheduleDayModel> _mapApiSchedulesToUiDays(List rawList) {
    final Map<String, _DayAcc> dayAcc = {};

    for (final raw in rawList) {
      if (raw is! Map) {
        continue; // Map is data structure built in dart, it stores key → value pairs
      }
      final map = raw.cast<String, dynamic>();

      final dayKey = _normalizeDayKey(map['day']);
      final dateStr = _formatApiDate(map['date']);
      final dayId = '$dayKey|$dateStr';

      final servicePatternId = (map['servicePatternId'] ?? '').toString();
      final servicePatternObj = map['servicePattern'];
      final servicePatternTitle = (servicePatternObj is Map)
          ? (servicePatternObj['title'] ?? '').toString()
          : '';

      final operatingTimes = <String>[];
      if (servicePatternObj is Map) {
        final operatingHours = servicePatternObj['operatingHours'];
        if (operatingHours is List) {
          for (final oh in operatingHours) {
            if (oh is! Map) continue;
            final hour = _toHourMinute(oh['hour']);
            if (hour.isEmpty) continue;
            operatingTimes.add(hour);
          }
        }
      }
      operatingTimes.sort();

      final day = dayAcc.putIfAbsent(
        dayId,
        () => _DayAcc(dayKey: dayKey, date: dateStr),
      );

      final spKey = servicePatternId.trim().isEmpty
          ? servicePatternTitle
          : servicePatternId;
      final sp = day.servicePatterns.putIfAbsent(
        spKey,
        () => _ServicePatternAcc(
          servicePatternId: servicePatternId,
          title: servicePatternTitle,
          operatingTimes: operatingTimes,
        ),
      );

      // parse trips -> group by route within this service pattern
      final timeline = map['timeline'];
      // check if the timeline is a list then do teh following
      // parse nested API/JSON data that looks like :
      // timeline → list of slots
      // slot → contains trips
      // trip → has time + route info

      if (timeline is List) {
        for (final slot in timeline) {
          if (slot is! Map) continue;
          final slotMap = slot.cast<String, dynamic>();

          final trips = slotMap['trips'];
          if (trips is! List) continue;

          for (final trip in trips) {
            if (trip is! Map) continue;
            final tripMap = trip.cast<String, dynamic>();

            // ------------------------------------------
            final time = _toHourMinute(tripMap['time']);
            if (time.isEmpty) continue;

            // ------------------------------------------
            // get teh route title
            final routeObj = tripMap['route'];
            final routeTitle = (routeObj is Map)
                ? (routeObj['title'] ?? '').toString()
                : '';
            if (routeTitle.trim().isEmpty) continue;

            // ------------------------------------------
            final routeColorHex = (routeObj is Map)
                ? (routeObj['color'] ?? '').toString()
                : '';
            final tabColorValue = parseRouteColor(routeColorHex).toARGB32();

            final routeAcc = sp.routes.putIfAbsent(
              routeTitle,
              () => _RouteAcc(tabColorValue: tabColorValue),
            );
            routeAcc.times.add(time);
          }
        }
      }
    }

    final result = <BusScheduleDayModel>[];
    for (final day in dayAcc.values) {
      final servicePatterns = day.servicePatterns.values.map((sp) {
        final routes = sp.routes.entries
            .map(
              (e) => BusScheduleRouteModel(
                routeName: e.key,
                tabColorValue: e.value.tabColorValue,
                departureTimes: (e.value.times.toList()..sort()),
              ),
            )
            .toList();

        return BusScheduleServicePatternModel(
          servicePatternId: sp.servicePatternId,
          title: sp.title,
          operatingTimes: sp.operatingTimes,
          routes: routes,
        );
      }).toList();

      result.add(
        BusScheduleDayModel(
          dayKey: day.dayKey,
          date: day.date,
          servicePatterns: servicePatterns,
        ),
      );
    }

    return result;
  }
  // =========================================================================

  String _normalizeDayKey(dynamic day) {
    final raw = (day ?? '').toString().trim().toLowerCase();
    switch (raw) {
      case 'monday':
        return 'monday';
      case 'tuesday':
        return 'tuesday';
      case 'wednesday':
      case 'wedensday':
        return 'wednesday';
      case 'thursday':
        return 'thursday';
      case 'friday':
        return 'friday';
      case 'saturday':
        return 'saturday';
      case 'sunday':
        return 'sunday';
      default:
        return raw;
    }
  }

  String _formatDate(DateTime d) {
    String two(int v) => v.toString().padLeft(2, '0');
    return '${d.year}-${two(d.month)}-${two(d.day)}';
  }

  // ------------------------------------------------------------
  // format the date from the API
  String _formatApiDate(dynamic value) {
    final s = (value ?? '').toString();
    final parsed = DateTime.tryParse(s);
    if (parsed == null) return s;
    String two(int v) => v.toString().padLeft(2, '0');
    return '${two(parsed.day)}/${two(parsed.month)}/${parsed.year}';
  }

  // -----------------------------------------------------------
  // convert the time to hour:minute format
  String _toHourMinute(dynamic time) {
    final s = (time ?? '').toString().trim();
    if (s.length >= 5) {
      return s.substring(0, 5);
    }
    return '';
  }
}

// ======================================================================
// helper class to accumulate route data
class _RouteAcc {
  final int tabColorValue;
  final Set<String> times = {};

  _RouteAcc({required this.tabColorValue});
}

// helper class to accumulate service pattern data
class _ServicePatternAcc {
  final String servicePatternId;
  final String title;
  final List<String> operatingTimes;
  final Map<String, _RouteAcc> routes = {};

  _ServicePatternAcc({
    required this.servicePatternId,
    required this.title,
    required this.operatingTimes,
  });
}

// helper class to accumulate day data
class _DayAcc {
  final String dayKey;
  final String date;
  final Map<String, _ServicePatternAcc> servicePatterns = {};

  _DayAcc({required this.dayKey, required this.date});
}
