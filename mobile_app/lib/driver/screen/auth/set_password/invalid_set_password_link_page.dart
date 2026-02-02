//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../../../service/localization/localization_service.dart';
import '../login/login_page.dart';

//========================================================

class InvalidSetPasswordLinkPage extends StatelessWidget {
  static const _burgundy = Color(0xFF59011A);
  static const _bg = Color(0xFFF2F1ED);

  const InvalidSetPasswordLinkPage({super.key});

  //========================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
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
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              
              const SizedBox(height: 40),
              
              // Title -----------------------------------------------------------
              Text(
                'driver_invalid_set_password_link_title'.translate,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.w800,
                  color: _burgundy,
                ),
              ),

              const SizedBox(height: 18),
              
              // Message -----------------------------------------------------------
              Text(
                'driver_invalid_set_password_link_message'.translate,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.black87,
                ),
              ),

              const SizedBox(height: 38),
              
              // Go to login button -----------------------------------------------------------
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pushReplacement(
                      MaterialPageRoute(builder: (_) => const LoginPage()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _burgundy,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  
                  // Button text -----------------------------------------------------------
                  child: Text(
                    'driver_invalid_set_password_link_go_login'.translate,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: _bg,
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
