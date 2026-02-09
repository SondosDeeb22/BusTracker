//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//========================================================

class SectionCard extends StatelessWidget {
  final Color borderColor;
  final String? title;
  final Widget child;

  const SectionCard({
    super.key,
    required this.borderColor,
    required this.title,
    required this.child,
  });

  // ==========================================================
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0x00FFFFFF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor, width: 1),
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title != null) ...[
            Text(
              title!,
              style: theme.textTheme.bodyMedium?.copyWith(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: cs.onBackground,
              ),
            ),

            const SizedBox(height: 12),
          ],

          child,
        ],
      ),
    );
  }
}
