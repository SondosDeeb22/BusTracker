//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import '../../model/bus_schedule_model.dart';

//========================================================
class RouteTabs extends StatelessWidget {
  final List<BusScheduleRouteModel> routes;
  final int selectedIndex;
  final ValueChanged<int> onSelect;
  final Widget? child;

  const RouteTabs({
    super.key,
    required this.routes,
    required this.selectedIndex,
    required this.onSelect,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    // Always render a non-overlapping layout: tabs (Wrap) above, then the content panel.
    // This avoids the persistent overlap issue in the first section.
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Wrap(
            spacing: 10,
            runSpacing: 8,
            children: List.generate(routes.length, (i) {
              final route = routes[i];
              final bgColor = route.tabColorValue;

              return Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () => onSelect(i),
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 8,
                    ),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: bgColor,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      route.routeName,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: _textColorFor(bgColor),
                      ),
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          decoration: BoxDecoration(
            color: colorScheme.surface,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: colorScheme.secondary),
          ),
          child: child ?? const SizedBox.shrink(),
        ),
      ],
    );
  }

  ///========================================================================================

  // select color according to the background color
  Color _textColorFor(Color bg) {
    final brightness = ThemeData.estimateBrightnessForColor(bg);
    return brightness == Brightness.dark ? Colors.white : Colors.black;
  }
}
