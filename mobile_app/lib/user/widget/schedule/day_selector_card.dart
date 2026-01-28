//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//========================================================

class DaySelectorCard extends StatelessWidget {
  final String dayLabel;
  final String date;
  final VoidCallback onTap;

  const DaySelectorCard({
    super.key,
    required this.dayLabel,
    required this.date,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        height: 64,
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 18),
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: colorScheme.secondary),
        ),

        // Day Selector Card Content ---------------------------------
        child: Row(
          children: [
            Expanded(
              child: Text(
                '$dayLabel $date',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: colorScheme.onSurface,
                ),
              ),
            ),

            Icon(Icons.expand_more, color: colorScheme.onSurface),
          ],
        ),
      ),
    );
  }
}
