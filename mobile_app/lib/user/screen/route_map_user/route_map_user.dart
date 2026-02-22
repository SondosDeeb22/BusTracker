//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../../controller/route_map/route_map_controller.dart';
import '../../../services/localization_service.dart';

import '../../widget/common/state_widgets.dart';
import '../../widget/route_map/route_map_view.dart';

//========================================================

class RouteMapUserScreen extends StatefulWidget {
  final String routeId;
  final String routeTitle;
  final int? routeColorInt;

  const RouteMapUserScreen({
    super.key,
    required this.routeId,
    required this.routeTitle,
    required this.routeColorInt,
  });

  @override
  State<RouteMapUserScreen> createState() => _RouteMapUserScreenState();
}

//========================================================

class _RouteMapUserScreenState extends State<RouteMapUserScreen> {
  final RouteMapController _controller = RouteMapController();
  final LocalizationService _localizationService = LocalizationService();

  //========================================================

  @override
  void initState() {
    super.initState();

    _controller.addListener(_onControllerChanged);
    _controller.loadRouteMap(widget.routeId);

    // Listen for language changes to rebuild UI
    _localizationService.addListener(_onLanguageChanged);
  }

  /// ------------------------------------------------------------------
  @override
  void dispose() {
    _controller.removeListener(_onControllerChanged);
    _controller.dispose();
    _localizationService.removeListener(_onLanguageChanged);
    super.dispose();
  }

  void _onControllerChanged() {
    if (mounted) {
      setState(() {});
    }
  }

  void _onLanguageChanged() {
    if (mounted) {
      setState(() {});
    }
  }

  //========================================================

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    final routeColor = widget.routeColorInt != null
        ? Color(widget.routeColorInt!)
        : colorScheme.secondary;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,

      // Building Top Bar =======================================================================================
      appBar: AppBar(
        backgroundColor: colorScheme.primary,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'map_route_title'.tr,
          style: TextStyle(
            color: colorScheme.onPrimary,
            fontWeight: FontWeight.w700,
          ),
        ),
        leading: IconButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          icon: Icon(Icons.arrow_back, color: colorScheme.onPrimary),
        ),
      ),

      //=======================================================================================
      body: SafeArea(
        bottom: false,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            //  Route Title ------------------------------------------
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
              child: Text(
                widget.routeTitle,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: colorScheme.onSurface,
                ),
              ),
            ),

            // view states when loading/ error/ empty ---------------
            if (_controller.loading)
              const LoadingStateWidget()
            else if (_controller.error != null)
              ErrorStateWidget(
                error: _controller.error!,
                onRetry: () {
                  _controller.loadRouteMap(widget.routeId);
                },
              )
            else if (_controller.route == null ||
                _controller.route!.points.isEmpty)
              Expanded(
                child: Center(
                  child: Text(
                    'map_no_points'.tr,
                    style: TextStyle(color: colorScheme.onSurface),
                  ),
                ),
              )
            else
              Expanded(
                child: RouteMapView(
                  route: _controller.route!,
                  routeColor: routeColor,
                ),
              ),
          ],
        ),
      ),
    );
    // );
  }
}
