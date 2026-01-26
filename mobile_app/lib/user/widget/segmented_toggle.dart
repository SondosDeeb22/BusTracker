//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//========================================================

class SegmentedToggle extends StatelessWidget {
  final Color burgundy;
  final bool selectedRight;
  final String leftText;
  final String rightText;
  final ValueChanged<bool> onChanged;

  const SegmentedToggle({
    super.key,
    required this.burgundy,
    required this.selectedRight,
    required this.leftText,
    required this.rightText,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      width: 280,
      height: 44,
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colorScheme.secondary),
      ),
      child: Row(
        children: [
          Expanded(
            child: InkWell(
              onTap: () => onChanged(false),
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: selectedRight ? Colors.transparent : burgundy,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  leftText,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: selectedRight
                        ? colorScheme.onSurface
                        : colorScheme.onPrimary,
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: InkWell(
              onTap: () => onChanged(true),
              child: Container(
                decoration: BoxDecoration(
                  color: selectedRight ? burgundy : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: Text(
                  rightText,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: selectedRight
                        ? colorScheme.onPrimary
                        : colorScheme.onSurface,
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
