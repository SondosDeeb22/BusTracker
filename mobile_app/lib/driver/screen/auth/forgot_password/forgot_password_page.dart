//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import '../../../controller/auth/forgot_password/forgot_password_controller.dart';
import '../../../widget/auth/forgot_password/forgot_password_form.dart';
//========================================================

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

//========================================================

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  static const _burgundy = Color(0xFF59011A);
  static const _bg = Color(0xFFF2F1ED);

  final ForgotPasswordController _controller = ForgotPasswordController();

  @override
  void initState() {
    super.initState();
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

  Future<void> _sendResetLink() async {
    final ok = await _controller.sendResetLink();
    if (!mounted) return;

    if (!ok) return;

    await Future<void>.delayed(const Duration(milliseconds: 900));
    if (!mounted) return;
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,

      // Upper part (Logo) -------------------------------------
      appBar: AppBar(
        backgroundColor: _burgundy,
        elevation: 0, // no shadow
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

      //------------------------------------------------------------------
      body: SafeArea(
        child: Column(
          children: [
            ForgotPasswordForm(
              emailController: _controller.emailController,
              isLoading: _controller.isLoading,
              onSendResetLink: _sendResetLink,
              errorMessage: _controller.inlineErrorMessage,
              successMessage: _controller.inlineSuccessMessage,
              primaryColor: _burgundy,
              backgroundColor: _bg,
            ),
          ],
        ),
      ),
    );
  }
}
