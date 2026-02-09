//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../../../controller/auth/set_password/set_password_controller.dart';
import '../../../service/auth/set_password/set_password_service.dart';

import '../login/login_page.dart';
import 'invalid_set_password_link_page.dart';
import '../../../widget/auth/set_password/set_password_form.dart';

//========================================================

class SetPasswordPage extends StatefulWidget {
  final String token;

  const SetPasswordPage({super.key, required this.token});

  @override
  State<SetPasswordPage> createState() => _SetPasswordPageState();
}

class _SetPasswordPageState extends State<SetPasswordPage> {
  late final SetPasswordController _controller;

  //========================================================

  @override
  void initState() {
    super.initState();
    _controller = SetPasswordController(token: widget.token);
    _controller.addListener(_onControllerChanged);

    _validateToken();
  }

  //========================================================

  Future<void> _validateToken() async {
    final service = SetPasswordService();
    final errorKeyOrMessage = await service.validateSetPasswordToken(
      token: widget.token,
    );

    if (errorKeyOrMessage == null) return;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const InvalidSetPasswordLinkPage()),
      );
    });
  }

  void _onControllerChanged() {
    if (_controller.shouldRedirectInvalidToken) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const InvalidSetPasswordLinkPage()),
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
    final bool setSucceeded = await _controller.submit();
    if (!mounted) return;

    if (!setSucceeded) return;

    if (!mounted) return;

    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginPage()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: theme.appBarTheme.backgroundColor,
        elevation: 0,
        toolbarHeight: 100,
        centerTitle: true,
        iconTheme: theme.appBarTheme.iconTheme,
        title: Image.asset(
          'assets/BusLogoWhite.png',
          width: 70,
          height: 70,
          fit: BoxFit.contain,
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [

            SetPasswordForm(
              newPasswordController: _controller.newPasswordController,
              confirmPasswordController: _controller.confirmPasswordController,
              isLoading: _controller.isLoading,
              errorMessage: _controller.errorMessage,
              onSubmit: _submit,
              primaryColor: cs.primary,
              backgroundColor: cs.onPrimary,
            ),
            
          ],
        ),
      ),
    );
  }
}
