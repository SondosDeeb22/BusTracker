//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';

import '../../../service/auth/logout/logout_service.dart';
import '../../../service/localization/localization_service.dart';

//========================================================
//? logout controller
//========================================================

class LogoutController extends ChangeNotifier {
  bool _isLoading = false;
  String? _errorMessage;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  //========================================================
  //? perform logout
  //========================================================

  Future<bool> logout() async {
    if (_isLoading) return false;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final service = LogoutService();
      final success = await service.logout();

      if (!success) {
        _errorMessage = 'driver_login_error_try_later'.translate;
        notifyListeners();
        return false;
      }

      notifyListeners();
      return true;

    // -------------------------------------------------------------------
    } catch (_) {
      _errorMessage = 'driver_login_error_try_later'.translate;
      notifyListeners();
      return false;

    // -------------------------------------------------------------------
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
