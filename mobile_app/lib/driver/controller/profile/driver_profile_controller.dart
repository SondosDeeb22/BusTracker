//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';

import '../../model/profile/driver_profile_models.dart';
import '../../service/profile/driver_profile_service.dart';

import '../../service/localization/localization_service.dart';

//========================================================

class DriverProfileController extends ChangeNotifier {
  bool _isLoading = false;
  String? _errorMessage;

  DriverProfileModel? _profile;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  DriverProfileModel? get profile => _profile;

  //========================================================
  // get the driver's data
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
  // update driver's phone number
  Future<bool> updatePhone(String phone) async {
    if (_isLoading) return false;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final service = DriverProfileService();
      final ok = await service.updatePhone(phone: phone);

      if (!ok) {
        _errorMessage = 'driver_login_error_try_later'.translate;
        notifyListeners();
        return false;
      }

      final refreshed = await service.fetchProfile();
      if (refreshed != null) {
        _profile = refreshed;
      }

      notifyListeners();
      return true;
    // -------------------------------------------------------------------
    } catch (_) {
      _errorMessage = 'driver_login_error_try_later'.translate;
      notifyListeners();
      return false;
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
