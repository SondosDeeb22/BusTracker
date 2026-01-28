//========================================================
//? forgot password models
//========================================================

class ForgotPasswordResult {
  final bool emailSent;
  final String message;

  const ForgotPasswordResult._({required this.emailSent, required this.message});

  factory ForgotPasswordResult.success(String message) {
    return ForgotPasswordResult._(emailSent: true, message: message);
  }

  factory ForgotPasswordResult.failure(String message) {
    return ForgotPasswordResult._(emailSent: false, message: message);
  }
}
