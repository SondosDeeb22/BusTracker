//========================================================
//? login models
//========================================================

class LoginResult {
  final bool loginSucceeded;
  final String message;

  const LoginResult._({required this.loginSucceeded, required this.message});

  factory LoginResult.success(String message) {
    return LoginResult._(loginSucceeded: true, message: message);
  }

  factory LoginResult.failure(String message) {
    return LoginResult._(loginSucceeded: false, message: message);
  }
}
