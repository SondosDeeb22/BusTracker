//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//========================================================

class InfoRow extends StatelessWidget {
  final String label;
  final String value;
  final VoidCallback? onEdit;

  const InfoRow({
    super.key,
    required this.label,
    required this.value,
    this.onEdit,
  });

  // ==========================================================
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: theme.textTheme.bodySmall?.copyWith(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: cs.onBackground,
                ),
              ),

              //-----------------------------
              const SizedBox(height: 4),

              //-----------------------------
              Text(
                value,
                style: theme.textTheme.bodySmall?.copyWith(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: cs.onBackground.withOpacity(0.7),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(width: 10),

        //add the "edit" icon
        if (onEdit != null)
          IconButton(
            onPressed: onEdit,
            icon: Icon(Icons.edit, size: 18, color: cs.primary),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
          )
        else
          const SizedBox.shrink(),
      ],
    );
  }
}
