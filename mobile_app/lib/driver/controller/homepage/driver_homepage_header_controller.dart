//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';

import '../../model/profile/driver_profile_models.dart';
import '../../service/profile/driver_profile_service.dart';

import '../../service/localization/localization_service.dart';

//========================================================
//? controller
//========================================================

class DriverHomepageHeaderController extends ChangeNotifier {
  bool _isLoading = false;
  String? _errorMessage;

  DriverProfileModel? _profile;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  String get driverName => _profile?.name ?? '';

  //========================================================
  //? fetch driver name
  //========================================================

  Future<void> fetch() async {
    if (_isLoading) return;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final service = DriverProfileService();
      final result = await service.fetchProfile();

      _profile = result;

      if (_profile == null) {
        _errorMessage = 'driver_login_error_try_later'.translate;
      }

      notifyListeners();
    // --------------------------------------------------------
    } catch (_) {
      _errorMessage = 'driver_login_error_try_later'.translate;
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
