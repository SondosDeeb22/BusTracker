//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import '../../../controller/auth/reset_password/reset_password_controller.dart';

import '../../../service/auth/reset_password/reset_password_service.dart';
import 'invalid_reset_link_page.dart';
import '../login/login_page.dart';
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

    _validateToken();
  }

  Future<void> _validateToken() async {
    final service = ResetPasswordService();
    final errorKeyOrMessage = await service.validateResetPasswordToken(
      token: widget.token,
    );

    if (errorKeyOrMessage == null) return;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const InvalidResetLinkPage()),
      );
    });
  }

  void _onControllerChanged() {
    if (_controller.shouldRedirectInvalidToken) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const InvalidResetLinkPage()),
        );
      });
      return;
    }

    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _controller.removeListener(_onControllerChanged);
    _controller.dispose();
    super.dispose();
  }

  //========================================================

  Future<void> _submit() async {
    final bool resetSucceeded = await _controller.submit();
    if (!mounted) return;

    if (!resetSucceeded) return;

    if (!mounted) return;

    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginPage()),
      (route) => false,
    );
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
