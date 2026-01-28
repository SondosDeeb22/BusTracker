//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../../model/bus_schedule_model.dart';
import 'route_tabs.dart';
import 'times_grid.dart';

//========================================================

class ServicePatternSection extends StatelessWidget {
  final BusScheduleServicePatternModel servicePattern;
  final int selectedRouteIndex;
  final ValueChanged<int> onSelectRoute;

  const ServicePatternSection({
    super.key,
    required this.servicePattern,
    required this.selectedRouteIndex,
    required this.onSelectRoute,
  });

  @override
  Widget build(BuildContext context) {
    final routes = servicePattern.routes;
    final safeIndex = routes.isEmpty
        ? 0
        : selectedRouteIndex.clamp(0, routes.length - 1);

    final hasOperatingTimes = servicePattern.operatingTimes.isNotEmpty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RouteTabs(
          routes: routes,
          selectedIndex: safeIndex,
          onSelect: onSelectRoute,
          child: hasOperatingTimes
              ? Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 8),
                    TimesGrid(times: servicePattern.operatingTimes),
                  ],
                )
              : null,
        ),
      ],
    );
  }
}
