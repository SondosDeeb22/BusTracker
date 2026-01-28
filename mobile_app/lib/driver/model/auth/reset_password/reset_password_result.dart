//========================================================
//? reset password models
//========================================================

class ResetPasswordResult {
  final bool passwordReset;
  final String message;

  const ResetPasswordResult._({
    required this.passwordReset,
    required this.message,
  });

  factory ResetPasswordResult.success(String message) {
    return ResetPasswordResult._(passwordReset: true, message: message);
  }

  factory ResetPasswordResult.failure(String message) {
    return ResetPasswordResult._(passwordReset: false, message: message);
  }
}
