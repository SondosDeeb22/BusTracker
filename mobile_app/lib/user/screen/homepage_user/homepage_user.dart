//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import '../account_settings_user/account_settings_user.dart';
import '../bus_schedule_user/bus_schedule_user.dart';
import 'package:mobile_app/user/service/route_api_service.dart';
import 'package:mobile_app/user/model/bus_route_card_model.dart';
import 'package:mobile_app/user/controller/route_color_parser.dart';
import 'package:mobile_app/user/widget/route_card.dart';
import 'package:mobile_app/user/widget/segmented_toggle.dart';
import 'package:mobile_app/user/widget/stat_card.dart';
import '../../../services/localization_service.dart';
//========================================================

// rendering user homepage screen, that contains :

// - a top AppBar (logo + settings)
// - status cards (working buses / total buses)
// - a toggle (Working / All)
// - a list of bus routes with a "View Location" button
class HomepageUser extends StatefulWidget {
  const HomepageUser({super.key});

  @override
  State<HomepageUser> createState() => _HomepageUserState();
}

//========================================================

// The State class holds all mutable values for HomepageUser
// When we call setState(...), Flutter rebuilds the UI using the updated values
class _HomepageUserState extends State<HomepageUser> {
  bool _showAll = false;

  int _bottomIndex = 0;

  bool _loading = true;
  String? _error;

  List<BusRouteCardModel> _allRoutes = const [];
  List<BusRouteCardModel> _operatingRoutes = const [];

  // Theme/colors used across this screen (kept here so you can reuse them easily).
  static const _burgundy = Color(0xFF59011A);
  // Remove hardcoded background colors - use theme instead

  final RouteApiService _routeApiService = RouteApiService();
  final LocalizationService _localizationService = LocalizationService();

  //========================================================
  @override
  void initState() {
    super.initState();
    _loadRoutes();

    // Listen for language changes to rebuild UI
    _localizationService.addListener(_onLanguageChanged);
  }

  @override
  void dispose() {
    _localizationService.removeListener(_onLanguageChanged);
    super.dispose();
  }

  void _onLanguageChanged() {
    if (mounted) {
      setState(() {});
    }
  }

  Future<void> _loadRoutes() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    // fetch routes from API    ===============================================
    try {
      final results = await Future.wait([
        _routeApiService.fetchAllRoutes(),
        _routeApiService.fetchOperatingRoutes(),
      ]);

      if (!mounted) return;
      setState(() {
        _allRoutes = results[0]
            .map(
              (r) => BusRouteCardModel(
                name: r.title,
                color: parseRouteColor(r.color),
                hasLocation: false,
              ),
            )
            .toList();

        _operatingRoutes = results[1]
            .map(
              (r) => BusRouteCardModel(
                name: r.title,
                color: parseRouteColor(r.color),
                hasLocation: true,
              ),
            )
            .toList();

        _loading = false;
      });
      //--------------------------------------
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = _formatConnectionError(e);
        _loading = false;
      });
    }
  }

  //=====================================================================
  // format connection error message

  String _formatConnectionError(Object e) {
    final message = e.toString();
    if (message.contains('SocketException') ||
        message.contains('Connection refused')) {
      return '${'connection_lost'.tr}. ${'server_error'.tr}.\n\n${'details'.tr}: $message';
    }
    return message;
  }

  //========================================================
  @override
  Widget build(BuildContext context) {
    // Counters used in the top status cards
    final workingCount = _operatingRoutes.length;
    final totalCount = _allRoutes.length;

    // Decide which routes to show depending on the toggle
    final visibleRoutes = _showAll ? _allRoutes : _operatingRoutes;

    return Scaffold(
      backgroundColor: Theme.of(
        context,
      ).scaffoldBackgroundColor, // Use theme background
      // Building Top Bar =======================================================================================
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.primary,
        elevation: 0,
        toolbarHeight: 100,
        centerTitle: true,
        automaticallyImplyLeading: false,

        // Logo in the center of AppBar.
        title: Image.asset(
          'assets/BusLogoWhite.png',
          width: 70,
          height: 70,
          fit: BoxFit.contain,
        ),

        // Right-side icons in AppBar (setting icon)
        actions: [
          IconButton(
            // TODO: open settings screen.
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const AccountSettingsUser()),
              );
            },
            icon: Icon(
              Icons.settings,
              color: Theme.of(context).colorScheme.onPrimary,
            ),
          ),
        ],
      ),

      //=======================================================================================
      body: SafeArea(
        //-------------------------------------------------------------------------------------------------------
        // Makes the page scrollable so it fits all screen sizes.
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,

              children: [
                const SizedBox(height: 6),

                //-----------------------------
                // Screen title
                Text(
                  'live_buses_status'.tr,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color:
                        Theme.of(context).textTheme.titleLarge?.color ??
                        Theme.of(context).colorScheme.onBackground,
                  ),
                ),

                //-----------------------------
                const SizedBox(height: 18),

                //-----------------------------
                // The two status cards row.
                Row(
                  children: [
                    Expanded(
                      child: StatCard(
                        borderColor: Theme.of(context).colorScheme.secondary,
                        title: 'currently_working'.tr,
                        value: '$workingCount ${'buses'.tr}',
                      ),
                    ),

                    const SizedBox(width: 18),

                    Expanded(
                      child: StatCard(
                        borderColor: Theme.of(context).colorScheme.secondary,
                        title: 'total_buses'.tr,
                        value: '$totalCount',
                      ),
                    ),
                  ],
                ),

                //-----------------------------
                const SizedBox(height: 22),

                //-----------------------------
                // Divider line.
                Container(
                  height: 1,
                  width: double.infinity,
                  color: Theme.of(context).colorScheme.secondary,
                ),

                //-----------------------------
                const SizedBox(height: 22),

                //-----------------------------
                // Toggle "Working" vs "All".
                // When it changes, we call setState to rebuild and show different list items.
                Center(
                  child: SegmentedToggle(
                    burgundy: _burgundy,
                    selectedRight: _showAll,

                    leftText: 'operating'.tr,
                    rightText: 'all'.tr,

                    onChanged: (value) {
                      setState(() {
                        _showAll = value;
                      });
                    },
                  ),
                ),

                //-----------------------------
                const SizedBox(height: 18),

                //-----------------------------
                // The list of route cards.
                if (_loading)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 24),
                    child: Center(
                      child: Column(
                        children: [
                          const CircularProgressIndicator(),
                          const SizedBox(height: 12),
                          Text('loading'.tr),
                        ],
                      ),
                    ),
                  )
                else if (_error != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 24),
                    child: Center(
                      child: Column(
                        children: [
                          Text(
                            _error!,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.onBackground,
                            ),
                          ),
                          const SizedBox(height: 12),
                          OutlinedButton(
                            onPressed: _loadRoutes,
                            child: Text('retry'.tr),
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  Column(
                    children: [
                      for (final route
                          in visibleRoutes) // visibleReoutes contains the routes (either all of them or only operating ones)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 16),

                          // Each route in the list becomes one UI card.
                          child: RouteCard(
                            background: Theme.of(context).colorScheme.surface,
                            routeName: route.name,
                            routeColor: route.color,

                            // In the "All" tab we hide the View Location button (your design).
                            // In the "Working" tab we show it (only for routes that have location).
                            showViewLocationButton:
                                !_showAll && route.hasLocation,

                            // TODO: navigate to map screen for this route
                            onViewLocation: () {},
                          ),
                        ),
                    ],
                  ),
              ],
            ),
          ),
        ),
      ),

      // bottom navigation bar ---------------------------------------------------
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _bottomIndex,
        onTap: (i) {
          if (i == _bottomIndex) return;

          if (i == 0) {
            Navigator.of(
              context,
            ).pushReplacement(_noAnimationRoute(const HomepageUser()));
            return;
          }

          if (i == 1) {
            Navigator.of(
              context,
            ).pushReplacement(_noAnimationRoute(const BusScheduleUser()));
            return;
          }

          setState(() {
            _bottomIndex = i;
          });
        },

        type: BottomNavigationBarType.fixed,
        backgroundColor: Theme.of(context).colorScheme.primary,
        selectedItemColor: Theme.of(context).colorScheme.secondary,
        unselectedItemColor: Colors.white,
        showSelectedLabels: false,
        showUnselectedLabels: false,

        items: const [
          // icon for Live Buses Status -------------------------------------------
          BottomNavigationBarItem(
            icon: Icon(Icons.directions_bus_outlined),
            label: 'Live',
          ),

          // icon for Bus Schedule -------------------------------------------------
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month_outlined),
            label: 'Schedule',
          ),
        ],
      ),
    );
  }
}

// ===========================================================================
// Helper: disable page transition animations for bottom nav
PageRoute<void> _noAnimationRoute(Widget page) {
  return PageRouteBuilder<void>(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionDuration: Duration.zero,
    reverseTransitionDuration: Duration.zero,
  );
}
