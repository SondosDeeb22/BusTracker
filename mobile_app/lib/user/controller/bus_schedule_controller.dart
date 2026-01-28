//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';
import '../model/bus_schedule_model.dart';
import '../service/bus_schedule_service.dart';
import '../../services/localization_service.dart';

//========================================================

//? controller for bus schedule screen
//? manages loading state, selected day/route, and derived UI data
//========================================================

class BusScheduleController {
  final BusScheduleService _busScheduleService;

  bool _loading = true;
  String? _error;

  List<BusScheduleDayModel> _days = const [];

  int _selectedDayIndex = 0;
  final Map<int, int> _selectedRouteIndexByServicePattern = {};

  // notify listeners -----------------------------------------------------
  final List<VoidCallback> _listeners = [];

  BusScheduleController({BusScheduleService? busScheduleService})
    : _busScheduleService = busScheduleService ?? BusScheduleService();

  //==================================================================================

  bool get loading => _loading;
  String? get error => _error;

  List<BusScheduleDayModel> get days => _days;

  int get selectedDayIndex => _selectedDayIndex;

  int selectedRouteIndexForServicePattern(int servicePatternIndex) {
    return _selectedRouteIndexByServicePattern[servicePatternIndex] ?? 0;
  }

  BusScheduleDayModel? get selectedDay =>
      _days.isEmpty ? null : _days[_selectedDayIndex];

  BusScheduleServicePatternModel? getServicePattern(int index) {
    final day = selectedDay;
    if (day == null) return null;
    if (index < 0 || index >= day.servicePatterns.length) return null;
    return day.servicePatterns[index];
  }

  BusScheduleRouteModel? getSelectedRoute(int servicePatternIndex) {
    final sp = getServicePattern(servicePatternIndex);
    if (sp == null) return null;
    if (sp.routes.isEmpty) return null;

    final routeIndex = selectedRouteIndexForServicePattern(servicePatternIndex);
    if (routeIndex < 0 || routeIndex >= sp.routes.length) return null;
    return sp.routes[routeIndex];
  }

  //==================================================================================

  void addListener(VoidCallback listener) {
    _listeners.add(listener);
  }

  void removeListener(VoidCallback listener) {
    _listeners.remove(listener);
  }

  void dispose() {
    _listeners.clear();
  }

  void _notify() {
    for (final l in List<VoidCallback>.from(_listeners)) {
      l();
    }
  }

  //==================================================================================

  Future<void> loadSchedule() async {
    _loading = true;
    _error = null;
    _notify();

    try {
      final result = await _busScheduleService.fetchUserBusSchedule();

      _days = result;
      _selectedDayIndex = 0;
      _selectedRouteIndexByServicePattern.clear();

      _loading = false;
      _notify();
    } catch (e) {
      _error = e.toString();
      _loading = false;
      _notify();
    }
  }

  //==================================================================================

  void selectDay(int index) {
    if (index < 0 || index >= _days.length) return;

    _selectedDayIndex = index;
    _selectedRouteIndexByServicePattern.clear();

    _notify();
  }

  void selectRoute(int servicePatternIndex, int routeIndex) {
    final sp = getServicePattern(servicePatternIndex);
    if (sp == null) return;
    if (routeIndex < 0 || routeIndex >= sp.routes.length) return;

    _selectedRouteIndexByServicePattern[servicePatternIndex] = routeIndex;
    _notify();
  }

  //==================================================================================

  String dayKeyToLabel(String key) {
    switch (key) {
      case 'monday':
        return 'day_monday'.tr;
      case 'tuesday':
        return 'day_tuesday'.tr;
      case 'wednesday':
        return 'day_wednesday'.tr;
      case 'thursday':
        return 'day_thursday'.tr;
      case 'friday':
        return 'day_friday'.tr;
      case 'saturday':
        return 'day_saturday'.tr;
      case 'sunday':
        return 'day_sunday'.tr;
      default:
        return key;
    }
  }
}
