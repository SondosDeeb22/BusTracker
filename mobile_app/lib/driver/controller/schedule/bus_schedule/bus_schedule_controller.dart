//========================================================
//? importing
//========================================================
import 'dart:async';

import 'package:flutter/foundation.dart';

import '../../../model/schedule/driver_schedule_models.dart';
import '../../../service/schedule/bus_schedule/bus_schedule_service.dart';

import '../../../service/localization/localization_service.dart';

//========================================================

class DriverBusScheduleController extends ChangeNotifier {
  bool _isLoading = false;
  String? _errorMessage;

  List<DriverScheduleDay> _days = const [];

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  List<DriverScheduleDay> get days => _days;

  //========================================================

  Future<void> fetch({String? driverId}) async {
    if (_isLoading) return;

    _isLoading = true;
    _errorMessage = null;
    if (kDebugMode) {
      print('DriverBusScheduleController: fetch() start driverId=$driverId');
    }
    notifyListeners();

    try {
      final service = DriverBusScheduleService();
      final result = await service.fetchSchedule(driverId: driverId);

      _days = result;

      if (_days.isEmpty) {
        _errorMessage = 'driver_schedule_error_no_data'.translate;
      }
    // --------------------------------------------------------
    } on TimeoutException {
      _errorMessage = 'driver_schedule_error_try_later'.translate;
    } catch (_) {
      _errorMessage = 'driver_schedule_error_try_later'.translate;
    } finally {
      _isLoading = false;
      if (kDebugMode) {
        print(
          'DriverBusScheduleController: fetch() done days=${_days.length} error=${_errorMessage ?? ''}',
        );
      }
      notifyListeners();
    }
  }

  //========================================================

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
