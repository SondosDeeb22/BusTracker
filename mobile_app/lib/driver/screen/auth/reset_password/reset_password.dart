//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import '../../../controller/auth/reset_password/reset_password_controller.dart';
import '../../../service/localization/localization_service.dart';

// widget
import '../../../widget/auth/reset_password/reset_password_form.dart';

//========================================================

class ResetPasswrodPage extends StatefulWidget {
  final String token;

  const ResetPasswrodPage({super.key, required this.token});

  @override
  State<ResetPasswrodPage> createState() => _ResetPasswrodPageState();
}

//========================================================

class _ResetPasswrodPageState extends State<ResetPasswrodPage> {
  static const _burgundy = Color(0xFF59011A);
  static const _bg = Color(0xFFF2F1ED);

  late final ResetPasswordController _controller;

  @override
  void initState() {
    super.initState();
    _controller = ResetPasswordController(token: widget.token);
    _controller.addListener(_onControllerChanged);
  }

  void _onControllerChanged() {
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _controller.removeListener(_onControllerChanged);
    _controller.dispose();
    super.dispose();
  }

  //========================================================

  Future<void> _showMessageDialog({
    required String title,
    required String message,
  }) async {
    if (!mounted) return;

    await showDialog<void>(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(),
              child: Text('driver_common_ok'.translate),
            ),
          ],
        );
      },
    );
  }

  //========================================================

  Future<void> _submit() async {
    final ok = await _controller.submit();
    if (!mounted) return;

    if (!ok) return;

    await _showMessageDialog(
      title: 'driver_reset_password_success_title'.translate,
      message:
          _controller.successMessage ??
          'driver_reset_password_success_message'.translate,
    );

    if (!mounted) return;
    Navigator.of(context).popUntil((route) => route.isFirst);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,

      // Upper part (Logo) -------------------------------------
      appBar: AppBar(
        backgroundColor: _burgundy,
        elevation: 0,
        toolbarHeight: 100,
        centerTitle: true,
        iconTheme: const IconThemeData(color: _bg),

        title: Image.asset(
          'assets/BusLogoWhite.png',
          width: 70,
          height: 70,
          fit: BoxFit.contain,
        ),
      ),

      // -----------------------------------------------------------
      body: SafeArea(
        child: Column(
          children: [
            ResetPasswordForm(
              newPasswordController: _controller.newPasswordController,
              confirmPasswordController: _controller.confirmPasswordController,
              isLoading: _controller.isLoading,
              errorMessage: _controller.errorMessage,
              onSubmit: _submit,
              primaryColor: _burgundy,
              backgroundColor: _bg,
            ),
          ],
        ),
      ),
    );
  }
}
