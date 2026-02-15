//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../../../services/localization_service.dart';

import '../../../theme/app_colors.dart';

import '../../model/homepage/user_route_model.dart';

//========================================================

class ExpandableRouteCard extends StatefulWidget {
  final UserRouteModel route;

  const ExpandableRouteCard({super.key, required this.route});

  @override
  State<ExpandableRouteCard> createState() => _ExpandableRouteCardState();
}

//========================================================

class _ExpandableRouteCardState extends State<ExpandableRouteCard> {
  bool _expanded = false;

  //========================================================
  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    final routeColor = widget.route.colorInt != null
        ? Color(widget.route.colorInt!)
        : colorScheme.secondary;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: colorScheme.secondary.withOpacity(0.35),
        ),
      ),
      child: Column(
        children: [
          _buildHeaderRow(colorScheme, routeColor),
          _buildExpandableSection(colorScheme),
        ],
      ),
    );
  }

  //----------------------------------------------------------------------------------------
  Widget _buildHeaderRow(ColorScheme colorScheme, Color routeColor) {
    return Row(
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
              widget.route.title,
              style: TextStyle(
                color: _textColorFor(routeColor),
                fontWeight: FontWeight.w500,
                fontSize: 18,
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        InkWell(
          onTap: () {
            setState(() {
              _expanded = !_expanded;
            });
          },
          borderRadius: BorderRadius.circular(16),
          child: Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: colorScheme.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: colorScheme.secondary),
            ),
            child: Icon(
              _expanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
              color: colorScheme.secondary,
            ),
          ),
        ),
      ],
    );
  }

  //----------------------------------------------------------------------------------------
  Widget _buildExpandableSection(ColorScheme colorScheme) {
    return ClipRect(
      child: AnimatedSize(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeInOut,
        alignment: Alignment.topCenter,
        child: Align(
          alignment: Alignment.topCenter,
          heightFactor: _expanded ? 1 : 0,
          child: Padding(
            padding: const EdgeInsets.only(top: 14),
            child: Column(
              children: [
                SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.burgundy,
                      foregroundColor: AppColors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      'homepage_view_route_on_map'.tr,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                for (final station in widget.route.stations)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: colorScheme.surface,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: colorScheme.secondary.withOpacity(0.35),
                        ),
                      ),
                      child: Text(
                        station.stationName,
                        style: TextStyle(
                          color: colorScheme.onSurface,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                if (widget.route.stations.isEmpty)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Text(
                      'homepage_no_stations_available'.tr,
                      style: TextStyle(
                        color: colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  //----------------------------------------------------------------------------------------
  Color _textColorFor(Color bg) {
    final brightness = ThemeData.estimateBrightnessForColor(bg);
    return brightness == Brightness.dark ? Colors.white : Colors.black;
  }
}
