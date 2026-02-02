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
  bool _shouldRedirectInvalidToken = false;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String? get successMessage => _successMessage;
  bool get shouldRedirectInvalidToken => _shouldRedirectInvalidToken;

  //========================================================

  Future<bool> submit() async {
    if (_isLoading) return false;

    final newPassword = newPasswordController.text;
    final confirmPassword = confirmPasswordController.text;

    _errorMessage = null;
    _successMessage = null;
    _shouldRedirectInvalidToken = false;

    if (newPassword.trim().isEmpty || confirmPassword.trim().isEmpty) {
      _errorMessage = 'driver_reset_password_error_fill_all_fields'.translate;
      notifyListeners();
      return false;
    }
    //test
    debugPrint('NEW: "${newPasswordController.text}"');
    debugPrint('CONFIRM: "${confirmPasswordController.text}"');

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

      final result = await service.resetPassword( // make the reset password request
        token: _token,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      );

      // if the reset password request failed  ___________________________________
      if (!result.passwordReset) {
        final rawMessage = result.message.trim();
        final translated = rawMessage.isEmpty ? '' : rawMessage.translate;

        // the token is invalid, so we redirect user to login page
        if (rawMessage == 'common.auth.invalidToken' ||
            translated == 'common.auth.invalidToken') {
          _shouldRedirectInvalidToken = true;
          _errorMessage = null;
          notifyListeners();
          return false;
        }

        // token is valid, the request failed for other reasons , so we show general error message 
        _errorMessage = rawMessage.isEmpty
            ? 'driver_reset_password_error_try_later'.translate
            : (translated == rawMessage ? rawMessage : translated);
        notifyListeners();
        return false;
      }
      // ___________________________________

      
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
