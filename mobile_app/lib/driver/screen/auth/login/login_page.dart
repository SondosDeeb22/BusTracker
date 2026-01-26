//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import '../forgot_password/forgot_password_page.dart';
import '../../homepage_driver/homepage_driver.dart';

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
  static const _border = Color(0xFFC9A47A);

  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,

      //------------------------------------------------------------------
      body: SafeArea(
        child: Column(
          children: [
            // Upper part (Logo) -------------------------------------
            Container(
              height: 400,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Color(0xFF59011A),
                borderRadius: BorderRadius.only(),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image(
                    image: AssetImage('assets/BusLogoWhite.png'),
                    width: 150,
                    height: 150,
                  ),

                  SizedBox(height: 20),

                  Text(
                    'NEU Bus Tracker',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: _bg,
                      fontSize: 30,
                      fontWeight: FontWeight.w600,
                    ),
                  ),

                  Text(
                    'Driver Login',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: _bg,
                      fontSize: 25,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),
            // login data form ===================================================================================
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 45,
                  vertical: 22,
                ),

                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 26),

                    // Email ----------------------------------------------------
                    TextField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        border: OutlineInputBorder(),
                      ),
                    ),

                    //----------------------------------------------------
                    const SizedBox(height: 16),

                    // Password ----------------------------------------------------
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: const InputDecoration(
                        labelText: 'Password',
                        border: OutlineInputBorder(),
                      ),
                    ),

                    //----------------------------------------------------
                    const SizedBox(height: 20),

                    // login Button ----------------------------------------------------
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () {
                          // TODO: integrate driver login (API/firebase/etc.)
                          Navigator.of(context).pushReplacement(
                            MaterialPageRoute(
                              builder: (_) => const HomepageDriver(),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _burgundy,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Login',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: _bg,
                          ),
                        ),
                      ),
                    ),

                    //----------------------------------------------------
                    const SizedBox(height: 12),

                    // forgot password Button ----------------------------------------------------
                    Align(
                      // wraped  TextButton widget with Align to control its position in the layout
                      alignment: Alignment.center,

                      child: TextButton(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) =>
                                  const ForgotPasswordPage(), // dircet driver to forgot password page
                            ),
                          );
                        },

                        child: const Text(
                          'Forgot password?',
                          style: TextStyle(
                            color: _burgundy,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
