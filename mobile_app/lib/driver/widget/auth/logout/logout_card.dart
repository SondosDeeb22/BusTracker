//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../../../service/localization/localization_service.dart';

//========================================================
//? logout card widget
//========================================================

class LogoutCard extends StatelessWidget {
  final Color borderColor;
  final VoidCallback onTap;

  const LogoutCard({
    super.key,
    required this.borderColor,
    required this.onTap,
  });

  // =========================================================

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Material(
      color: cs.background,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            border: Border.all(color: borderColor),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Row(
            children: [
              // Logout icon ----------------
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: cs.surfaceContainerHighest,
                  border: Border.all(color: cs.secondary),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.logout,
                  color: cs.error,
                  size: 24,
                ),
              ),

              const SizedBox(width: 16),

              // Logout text ----------------
              Expanded(
                child: Text(
                  'driver_profile_logout'.translate,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: cs.error,
                  ),
                ),
              ),

              // Arrow icon ----------------
              Icon(
                Icons.chevron_right,
                color: cs.onSurfaceVariant,
                size: 24,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
