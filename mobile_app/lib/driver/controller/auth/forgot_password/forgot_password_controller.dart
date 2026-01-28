//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../../../service/auth/forgot_password/forgot_password_service.dart';
import '../../../service/localization/localization_service.dart';

//========================================================

class ForgotPasswordController extends ChangeNotifier {
  final TextEditingController emailController = TextEditingController();

  bool _isLoading = false;
  bool? _resetEmailSent;
  String? _lastMessage;
  String? _inlineErrorMessage;
  String? _inlineSuccessMessage;

  bool get isLoading => _isLoading;
  bool? get resetEmailSent => _resetEmailSent;
  String? get lastMessage => _lastMessage;
  String? get inlineErrorMessage => _inlineErrorMessage;
  String? get inlineSuccessMessage => _inlineSuccessMessage;

  //========================================================

  Future<bool> sendResetLink() async {
    if (_isLoading) return false;

    final email = emailController.text.trim();
    if (email.isEmpty) {
      _inlineErrorMessage = missingEmailMessage();
      _inlineSuccessMessage = null;
      notifyListeners();
      return false;
    }

    _isLoading = true;
    _resetEmailSent = null;
    _lastMessage = null;
    _inlineErrorMessage = null;
    _inlineSuccessMessage = null;
    notifyListeners();

    try {
      final service = ForgotPasswordService();
      final result = await service.sendResetEmail(email: email);

      _resetEmailSent = result.emailSent;
      _lastMessage = result.message;

      final message = result.message.trim();
      final translatedMessage = message.isEmpty ? '' : message.translate;

      if (result.emailSent) {
        _inlineSuccessMessage = translatedMessage.isEmpty
            ? emailSentTitle()
            : translatedMessage;
      } else {
        _inlineErrorMessage = translatedMessage.isEmpty
            ? genericErrorMessage()
            : translatedMessage;
      }

      notifyListeners();
      return result.emailSent;

      //-----------------------------------------------------
    } catch (_) {
      _resetEmailSent = false;
      _inlineErrorMessage = genericErrorMessage();
      _inlineSuccessMessage = null;
      return false;

      //-----------------------------------------------------
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  //========================================================

  String missingEmailTitle() =>
      'driver_forgot_password_missing_email_title'.translate;
  String missingEmailMessage() =>
      'driver_forgot_password_missing_email_message'.translate;

  String requestFailedTitle() =>
      'driver_forgot_password_request_failed_title'.translate;

  String emailSentTitle() =>
      'driver_forgot_password_email_sent_title'.translate;

  String genericErrorTitle() => 'driver_forgot_password_error_title'.translate;
  String genericErrorMessage() =>
      'driver_forgot_password_error_message'.translate;

  //========================================================
  // clean up listener when widget is disposed
  @override
  void dispose() {
    emailController.dispose();
    super.dispose();
  }
}
