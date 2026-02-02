//========================================================
//? set password models
//========================================================

class SetPasswordResult {
  final bool passwordSet;
  final String message;

  const SetPasswordResult._({required this.passwordSet, required this.message});

  factory SetPasswordResult.success(String message) {
    return SetPasswordResult._(passwordSet: true, message: message);
  }

  factory SetPasswordResult.failure(String message) {
    return SetPasswordResult._(passwordSet: false, message: message);
  }
}
