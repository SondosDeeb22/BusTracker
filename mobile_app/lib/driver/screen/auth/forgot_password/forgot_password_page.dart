//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import '../reset_password/reset_password.dart';

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
  static const _border = Color(0xFFC9A47A);

  final _emailController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
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
            // forgot password portion ===================================================================================
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 50,
                  vertical: 22,
                ),

                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    //-----------------------------------------------------
                    const SizedBox(height: 50),

                    //-----------------------------------------------------
                    const Text(
                      'Forgot your Password?',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: Colors.black,
                      ),
                    ),

                    //-----------------------------------------------------
                    const SizedBox(height: 40),

                    //-----------------------------------------------------
                    const Text(
                      'No stress. Enter the email associated with your account and we’ll send you a reset link to get you back on track',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.black,
                      ),
                    ),

                    //-----------------------------------------------------
                    const SizedBox(height: 40),

                    //-----------------------------------------------------
                    TextField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        border: OutlineInputBorder(),
                      ),
                    ),

                    //-----------------------------------------------------
                    const SizedBox(height: 50),

                    //-----------------------------------------------------
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () {
                          // TODO: trigger forgot-password flow / send reset email
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => const ResetPasswrodPage(),
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
                          'send rest link',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
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
