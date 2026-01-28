//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//screen
import '../forgot_password/forgot_password_page.dart';
import '../../homepage_driver/homepage_driver.dart';

// controller
import '../../../controller/auth/login/login_controller.dart';

//widgets
import '../../../widget/auth/login/login_form.dart';
import '../../../widget/auth/login/login_header.dart';

//========================================================

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

//========================================================

class _LoginPageState extends State<LoginPage> {
  static const _burgundy = Color(0xFF59011A);
  static const _bg = Color(0xFFF2F1ED);

  final LoginController _controller = LoginController();

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onControllerChanged);
  }

  void _onControllerChanged() {
    if (mounted) setState(() {}); // re-render because external state changed( it could be isloadign or errorMessage)
  }

 // clean up listener when widget is disposed
  @override
  void dispose() {
    _controller.removeListener(_onControllerChanged);
    _controller.dispose();
    super.dispose();
  }

  // =======================================================================
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,

      //------------------------------------------------------------------
      body: SafeArea(
        child: Column(
          children: [
            // Upper part (Logo) -------------------------------------
            const LoginHeader(background: _burgundy, textColor: _bg),
            
            // login data form ===================================================================================
            LoginForm(
              emailController: _controller.emailController,
              passwordController: _controller.passwordController,
              loginErrorMessage: _controller.loginErrorMessage,
              isLoading: _controller.isLoading,
              primaryColor: _burgundy,
              backgroundColor: _bg,

              onLogin: () async {
                final loginSucceeded = await _controller.login();
                if (!loginSucceeded) return;
                if (!mounted) return;

                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const HomepageDriver()),
                );
              },

              // =================================================================
              onForgotPassword: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) =>
                        const ForgotPasswordPage(), // dircet driver to forgot password page
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
