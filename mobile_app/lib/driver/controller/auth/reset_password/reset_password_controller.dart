//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../../../service/auth/reset_password/reset_password_service.dart';
import '../../../service/localization/localization_service.dart';

//========================================================

class ResetPasswordController extends ChangeNotifier {
  final String _token;
  final TextEditingController newPasswordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();

  ResetPasswordController({required String token}) : _token = token;

  bool _isLoading = false;
  String? _errorMessage;
  String? _successMessage;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String? get successMessage => _successMessage;

  //========================================================

  Future<bool> submit() async {
    if (_isLoading) return false;

    final newPassword = newPasswordController.text;
    final confirmPassword = confirmPasswordController.text;

    _errorMessage = null;
    _successMessage = null;

    if (newPassword.trim().isEmpty || confirmPassword.trim().isEmpty) {
      _errorMessage = 'driver_reset_password_error_fill_all_fields'.translate;
      notifyListeners();
      return false;
    }

    if (newPassword != confirmPassword) {
      _errorMessage =
          'driver_reset_password_error_passwords_do_not_match'.translate;
      notifyListeners();
      return false;
    }

    _isLoading = true;
    notifyListeners();

    // ----------------------------------------------------------------
    try {
      final service = ResetPasswordService();
      final result = await service.resetPassword(
        token: _token,
        newPassword: newPassword,
      );

      if (!result.passwordReset) {
        _errorMessage = result.message.trim().isEmpty
            ? 'driver_reset_password_error_try_later'.translate
            : result.message;
        notifyListeners();
        return false;
      }

      _successMessage = result.message.trim().isEmpty
          ? 'driver_reset_password_success_message'.translate
          : result.message;
      notifyListeners();
      return true;
      // ----------------------------------------------------------------
    } catch (_) {
      _errorMessage = 'driver_reset_password_error_try_later'.translate;
      notifyListeners();
      return false;

      // ----------------------------------------------------------------
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  //========================================================

  @override
  void dispose() {
    newPasswordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }
}
