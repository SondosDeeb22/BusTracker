//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//========================================================

class RouteCard extends StatelessWidget {
  final Color background;
  final String routeName;
  final Color routeColor;
  final VoidCallback onViewLocation;
  final bool showViewLocationButton;

  const RouteCard({
    super.key,
    required this.background,
    required this.routeName,
    required this.routeColor,
    required this.onViewLocation,
    required this.showViewLocationButton,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              height: 46,
              decoration: BoxDecoration(
                color: routeColor,
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.centerLeft,
              padding: const EdgeInsets.symmetric(horizontal: 18),
              child: Text(
                routeName,
                style: TextStyle(
                  color: _textColorFor(routeColor),
                  fontWeight: FontWeight.w500,
                  fontSize: 18,
                ),
              ),
            ),
          ),
          if (showViewLocationButton) ...[
            const SizedBox(width: 12),
            SizedBox(
              width: 78,
              height: 46,
              child: OutlinedButton(
                onPressed: onViewLocation,
                style: OutlinedButton.styleFrom(
                  backgroundColor: colorScheme.surface,
                  side: BorderSide(color: colorScheme.secondary),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                ),
                child: Text(
                  'View\nLocation',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: colorScheme.onSurface,
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  //----------------------------------------------------------------------------------------
  // Returns the appropriate text color based on the background color's brightness
  Color _textColorFor(Color bg) {
    final brightness = ThemeData.estimateBrightnessForColor(bg);
    return brightness == Brightness.dark ? Colors.white : Colors.black;
  }
}
