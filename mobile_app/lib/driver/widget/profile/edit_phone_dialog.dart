//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../../service/localization/localization_service.dart';

//========================================================

Future<String?> showEditPhoneDialog({
  required BuildContext context,
  required String currentPhone,
}) async {
  final phoneController = TextEditingController(text: currentPhone);

  final result = await showDialog<bool>(
    context: context,
    builder: (context) {
      final theme = Theme.of(context);
      final cs = theme.colorScheme;

      return Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        child: Container(
          width: 520,
          padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 25),
          decoration: BoxDecoration(
            color: theme.dialogBackgroundColor,
            borderRadius: BorderRadius.circular(14),
          ),

          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // title ----------------------------------------------------------------
              Text(
                'driver_profile_edit_phone_title'.translate,
                style: theme.textTheme.titleMedium?.copyWith(
                  fontSize: 19,
                  fontWeight: FontWeight.w800,
                  color: cs.onSurface,
                ),
              ),

              const SizedBox(height: 18),

              // phone input ----------------------------------------------------------
              SizedBox(
                width: double.infinity,
                height: 50,
                child: TextField(
                  controller: phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: InputDecoration( 
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // actions --------------------------------------------------------------
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(false),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: cs.onSurface,
                      side: BorderSide(color: cs.outlineVariant),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 10,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text('driver_profile_action_cancel'.translate),
                  ),

                  const SizedBox(width: 14),

                  ElevatedButton(
                    onPressed: () => Navigator.of(context).pop(true),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: cs.primary,
                      foregroundColor: cs.onPrimary,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 10,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text('driver_profile_action_save'.translate),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    },
  );

  if (result != true) return null;

  final newPhone = phoneController.text.trim();
  if (newPhone.isEmpty) return null;

  return newPhone;
}
