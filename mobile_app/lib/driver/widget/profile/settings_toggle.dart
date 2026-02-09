//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//========================================================

class SettingsToggle extends StatelessWidget {
  final Color selectedItemColor;
  final String leftText;
  final String rightText;
  final bool selectedRight;
  final ValueChanged<bool> onChanged;

  const SettingsToggle({
    super.key,
    required this.selectedItemColor,
    required this.leftText,
    required this.rightText,
    required this.selectedRight,
    required this.onChanged,
  });

  // ==========================================================
  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Container(
      width: 260,
      height: 44,
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: cs.secondary),
      ),

      child: Row(
        children: [
          // control the left-side of the toggle (Operating) ---------------------------------------------------------------
          Expanded(
            child: InkWell(
              onTap: () => onChanged(false),
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: selectedRight ? Colors.transparent : selectedItemColor,
                  borderRadius: BorderRadius.circular(10),
                ),

                child: Text(
                  leftText,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: selectedRight ? cs.onSurface : cs.onPrimary,
                  ),
                ),
              ),
            ),
          ),

          // control the right-side of the toggle ---------------------------------------------------------------
          Expanded(
            child: InkWell(
              onTap: () => onChanged(true),
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: selectedRight ? selectedItemColor : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),

                child: Text(
                  rightText,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: selectedRight ? cs.onPrimary : cs.onSurface,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
