//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../../model/homepage/bus_option.dart';

//========================================================
//? widget
//========================================================

// disply the Tracking Status Card =====================================================================================
class TrackingCard extends StatelessWidget {
  final Color borderColor;
  final bool expanded;
  final BusOption currentBus;
  final bool paused;
  final VoidCallback onToggleExpanded;
  final ValueChanged<bool> onTogglePaused;
  final List<BusOption> buses;
  final ValueChanged<BusOption> onSelectBus;

  const TrackingCard({
    super.key,
    required this.borderColor,
    required this.expanded,
    required this.currentBus,
    required this.paused,
    required this.onToggleExpanded,
    required this.onTogglePaused,
    required this.buses,
    required this.onSelectBus,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0x00FFFFFF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor, width: 1),
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // -----------------------------------------------------------------------------------------
          Row(
            children: [
              Expanded(
                child: Text(
                  'Tracking Status',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: cs.onBackground,
                  ),
                ),
              ),

              // widget to change the "expanded" status of the trakcing box-------------------------------
              InkWell(
                onTap: onToggleExpanded,
                child: Container(
                  width: 26,
                  height: 26,
                  decoration: BoxDecoration(
                    color: cs.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: cs.outlineVariant),
                  ),

                  // display arrow icon in the tracking box (according to expanded status) -------------------------------
                  child: Icon(
                    expanded
                        ? Icons.keyboard_arrow_up
                        : Icons.keyboard_arrow_down,
                    color: cs.onSurface,
                  ),
                ),
              ),
            ],
          ),

          // -----------------------------------------------------------------------------------------
          const SizedBox(height: 10),

          // dividor in tracking box ==========================================================================
          Container(height: 1, width: double.infinity, color: borderColor),

          //-------------------------------
          const SizedBox(height: 12),

          // view the current bus title and color =======================================================
          Container(
            height: 40,
            width: double.infinity,
            decoration: BoxDecoration(
              color: currentBus.color,
              borderRadius: BorderRadius.circular(10),
            ),
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: Text(
              currentBus.name,
              style: TextStyle(
                color: _textColorFor(currentBus.color),
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
          ),
          //========================================================================================

          //-------------------------------
          const SizedBox(height: 12),

          // display the tracking status toggle -------------------------------
          _StatusToggle(
            borderColor: const Color(0xFFE7D7C2),
            leftSelected: !paused,
            onChanged: (leftSelected) => onTogglePaused(!leftSelected),
          ),
          //-------------------------------

          // if tracking status box was expanded, we display the routes title  using  _BusSelectRow
          if (expanded) ...[
            const SizedBox(height: 16),

            for (final bus in buses) ...[
              _BusSelectRow(bus: bus, onSelect: () => onSelectBus(bus)),

              const SizedBox(height: 12),
            ],
          ],
        ],
      ),
    );
  }

  // Estimate brightness to pick readable text color.
  // Dark background => white text, light background => black text
  Color _textColorFor(Color bg) {
    final brightness = ThemeData.estimateBrightnessForColor(bg);
    return brightness == Brightness.dark ? Colors.white : Colors.black;
  }
}

// Control the Tracking Status Toggle ==================================================================================================
class _StatusToggle extends StatelessWidget {
  final Color borderColor;
  final bool leftSelected;
  final ValueChanged<bool> onChanged;

  const _StatusToggle({
    required this.borderColor,
    required this.leftSelected,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Container(
      height: 70,
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),

      child: Row(
        children: [
          // control the left-side of the toggle (Operating) ---------------------------------------------------------------
          Expanded(
            child: InkWell(
              onTap: () => onChanged(true),
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: leftSelected
                      ? const Color(0xFF59011A)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),

                child: Text(
                  'Operating',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: leftSelected ? cs.onPrimary : cs.onSurface,
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(width: 10),

          // control the right-side of the toggle (Paused) ---------------------------------------------------------------
          Expanded(
            child: InkWell(
              onTap: () => onChanged(false),
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: leftSelected
                      ? Colors.transparent
                      : const Color(0xFFC9B08A),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  'Paused',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: cs.onSurface,
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

// display: (route title + color ) ( select ) in row ========this is used if expanded arrow was opend in tracking status card ============================================================================================
class _BusSelectRow extends StatelessWidget {
  final BusOption bus;
  final VoidCallback onSelect;

  const _BusSelectRow({required this.bus, required this.onSelect});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // view the route title and color ---------------------------------------------------------------------
        Expanded(
          child: Container(
            height: 34,

            decoration: BoxDecoration(
              color: bus.color,
              borderRadius: BorderRadius.circular(8),
            ),

            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.symmetric(horizontal: 14),

            child: Text(
              bus.name,
              style: TextStyle(
                color: _textColorFor(bus.color),
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
          ),
        ),

        const SizedBox(width: 10),

        // view "Select" button for each route ---------------------------------------------------------------
        SizedBox(
          width: 70,
          height: 34,
          child: OutlinedButton(
            onPressed: onSelect,
            style: OutlinedButton.styleFrom(
              backgroundColor: const Color(0xFFF5EFE6),
              side: const BorderSide(color: Color(0xFFE4D4BF)),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              padding: EdgeInsets.zero,
            ),
            child: const Text(
              'Select',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Color _textColorFor(Color bg) {
    final brightness = ThemeData.estimateBrightnessForColor(bg);
    return brightness == Brightness.dark ? Colors.white : Colors.black;
  }
}
