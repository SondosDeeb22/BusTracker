//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../../../service/localization/localization_service.dart';

//========================================================

class SetPasswordForm extends StatelessWidget {
  final TextEditingController newPasswordController;
  final TextEditingController confirmPasswordController;

  final bool isLoading;
  final String? errorMessage;

  final VoidCallback onSubmit;

  final Color primaryColor;
  final Color backgroundColor;

  const SetPasswordForm({
    super.key,
    required this.newPasswordController,
    required this.confirmPasswordController,
    required this.isLoading,
    required this.errorMessage,
    required this.onSubmit,
    required this.primaryColor,
    required this.backgroundColor,
  });

  //========================================================

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 22),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [

                const SizedBox(height: 50),

                // title -----------------------------------------------------------
                Text(
                  'driver_set_password_title'.translate,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: Colors.black,
                  ),
                ),

                const SizedBox(height: 30),

                // new password -----------------------------------------------------------
                TextField(
                  controller: newPasswordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'driver_set_password_new_password_label'.translate,
                    border: const OutlineInputBorder(),
                  ),
                ),
                
                
                const SizedBox(height: 20),
                                
                // confirm password -----------------------------------------------------------
                TextField(
                  controller: confirmPasswordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText:
                        'driver_set_password_confirm_password_label'.translate,
                    border: const OutlineInputBorder(),
                  ),
                ),


                // error message -----------------------------------------------------------
                if (errorMessage != null && errorMessage!.trim().isNotEmpty) ...[
                  const SizedBox(height: 10),
                  Padding(
                    padding: const EdgeInsets.only(left: 4),
                    child: Text(
                      errorMessage!,
                      style: const TextStyle(
                        color: Color(0xFF59011A),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                ] else ...[
                  const SizedBox(height: 20),
                ],

                // Submit button -----------------------------------------------------------
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: isLoading ? null : onSubmit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: isLoading
                        ? SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.5,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                backgroundColor,
                              ),
                            ),
                          )
                        : Text(
                            'driver_set_password_button'.translate,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: backgroundColor,
                            ),
                          ),
                  ),
                ),

                
              ],
            ),
          ),
        ),
      ),
    );
  }
}
