//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

// service
import '../../../service/auth/login/login_service.dart';

// translation
import '../../../service/localization/localization_service.dart';

//========================================================

class LoginController extends ChangeNotifier {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  bool _isLoading = false;
  String? _loginErrorMessage;

  bool get isLoading => _isLoading;
  String? get loginErrorMessage => _loginErrorMessage;

  //========================================================

  Future<bool> login() async {
    if (_isLoading) return false;

    final email = emailController.text.trim();
    final password = passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      _loginErrorMessage = 'driver_login_error_fill_all_fields'.translate;
      notifyListeners();
      return false;
    }

    _isLoading = true;
    _loginErrorMessage = null;
    notifyListeners();

    try {
      final service = LoginService();
      final result = await service.login(email: email, password: password);

      if (!result.loginSucceeded) {
        _loginErrorMessage = 'driver_login_error_invalid_credentials'.translate;
        notifyListeners();
        return false;
      }

      return true;

      //----------------------------------------------
      // show the same error message regardless of the error case
    } catch (_) {
      _loginErrorMessage = 'driver_login_error_try_later'.translate;
      notifyListeners();
      return false;

      //-----------------------------------------------------
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  //========================================================
  // clean up listener when widget is disposed
  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
