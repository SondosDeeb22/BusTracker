//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';

// service
import '../../service/route_api_service.dart';

// model
import '../../model/map/route_map_model.dart';

//========================================================
//? controller for user route map screen
// manages loading/error and selected route map data
//========================================================
class RouteMapController {
  final RouteApiService _routeApiService;

  bool _loading = true;
  String? _error;

  RouteMapModel? _route;

  // notify listeners -----------------------------------------------------
  final List<VoidCallback> _listeners = [];

  RouteMapController({RouteApiService? routeApiService})
      : _routeApiService = routeApiService ?? RouteApiService();

  //==================================================================================

  bool get loading => _loading;
  String? get error => _error;
  RouteMapModel? get route => _route;

  //==================================================================================

  void addListener(VoidCallback listener) {
    _listeners.add(listener);
  }

  void removeListener(VoidCallback listener) {
    _listeners.remove(listener);
  }

  void dispose() {
    _listeners.clear();
  }

  void _notify() {
    for (final l in List<VoidCallback>.from(_listeners)) {
      l();
    }
  }

  //==================================================================================

  Future<void> loadRouteMap(String routeId) async {
    _loading = true;
    _error = null;
    _route = null;
    _notify();

    try {
      final routes = await _routeApiService.fetchRoutesMap();
      _route = routes.where((route) => route.id == routeId).isNotEmpty
          ? routes.firstWhere((route) => route.id == routeId)
          : null;

      _loading = false;
      _notify();

      // ---------------------------------------------
    } catch (error) {
      _error = error.toString();
      _loading = false;
      _notify();
    }
  }
}
