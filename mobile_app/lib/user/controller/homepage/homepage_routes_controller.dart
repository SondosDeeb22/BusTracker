//========================================================
//? importing
//========================================================
import 'package:flutter/foundation.dart';

// service
import '../../service/route_api_service.dart';

// model
import '../../model/homepage/user_route_model.dart';

//========================================================
//? controller for user homepage routes list
//? manages loading/error/routes state and notifies UI listeners
//========================================================
class HomepageRoutesController {
  final RouteApiService _routeApiService;

  bool _loading = true;
  String? _error;

  List<UserRouteModel> _routes = const [];

  // notify listeners -----------------------------------------------------
  final List<VoidCallback> _listeners = [];

  HomepageRoutesController({RouteApiService? routeApiService})
      : _routeApiService = routeApiService ?? RouteApiService();

  //==================================================================================

  bool get loading => _loading;
  String? get error => _error;
  List<UserRouteModel> get routes => _routes;

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

  // load routes from API 
  Future<void> loadRoutes() async {
    _loading = true;
    _error = null;
    _notify();

    try {
      final result = await _routeApiService.fetchAllUserRoutes(); 
      _routes = result;
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
