//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';

import '../../../model/schedule/weekly_bus_schedule/driver_weekly_schedule_models.dart';
import '../../../service/schedule/weekly_bus_schedule/weekly_bus_schedule_service.dart';

import '../../../service/localization/localization_service.dart';

//========================================================

class DriverWeeklyBusScheduleController extends ChangeNotifier {
  bool _isLoading = false;
  String? _errorMessage;

  List<DriverWeeklyScheduleDay> _days = const [];

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  List<DriverWeeklyScheduleDay> get days => _days;

  //========================================================

  Future<void> fetch({String? driverId}) async {
    if (_isLoading) return;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final service = DriverWeeklyBusScheduleService();
      final result = await service.fetchWeeklySchedule(driverId: driverId);

      _days = result;

      if (_days.isEmpty) {
        _errorMessage = 'driver_weekly_schedule_error_no_data'.translate;
      }

      notifyListeners();
    // --------------------------------------------------------
    } catch (_) {
      _errorMessage = 'driver_weekly_schedule_error_try_later'.translate;
      notifyListeners();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  //========================================================

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
