//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//========================================================

class ResetPasswrodPage extends StatefulWidget {
  const ResetPasswrodPage({super.key});

  @override
  State<ResetPasswrodPage> createState() => _ResetPasswrodPageState();
}

//========================================================

class _ResetPasswrodPageState extends State<ResetPasswrodPage> {
  static const _burgundy = Color(0xFF59011A);
  static const _bg = Color(0xFFF2F1ED);
  static const _border = Color(0xFFC9A47A);

  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  // functin to reset driver password
  void _resetPassword() {
    // TODO: validate + call reset password endpoint
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
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 22),

          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,

            children: [
              //-----------------------------------------------------
              const SizedBox(height: 50),

              //-----------------------------------------------------
              const Text(
                'Reset Password',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: Colors.black,
                ),
              ),

              //-----------------------------------------------------
              const SizedBox(height: 50),

              //-----------------------------------------------------
              TextField(
                controller: _newPasswordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'New Password',
                  border: OutlineInputBorder(),
                ),
              ),

              //-----------------------------------------------------
              const SizedBox(height: 20),

              //-----------------------------------------------------
              TextField(
                controller: _confirmPasswordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Confirm Password',
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
                  onPressed: _resetPassword,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _burgundy,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Reset Password',
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
    );
  }
}
