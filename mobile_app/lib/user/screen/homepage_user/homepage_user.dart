//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import '../account_settings_user/account_settings_user.dart';
import '../bus_schedule_user/bus_schedule_user.dart';
import 'package:mobile_app/user/controller/homepage/homepage_routes_controller.dart';
import 'package:mobile_app/user/widget/homepage/expandable_route_card.dart';

import '../../../services/localization_service.dart';

import '../../../common/pull_to_refresh.dart';
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
  int _bottomIndex = 0;

  final HomepageRoutesController _homepageRoutesController =
      HomepageRoutesController();
  final LocalizationService _localizationService = LocalizationService();

  //========================================================
  @override
  void initState() {
    super.initState();

    _homepageRoutesController.addListener(_onRoutesChanged);
    _homepageRoutesController.loadRoutes();

    // Listen for language changes to rebuild UI
    _localizationService.addListener(_onLanguageChanged);
  }

  @override
  void dispose() {
    _homepageRoutesController.removeListener(_onRoutesChanged);
    _homepageRoutesController.dispose();
    _localizationService.removeListener(_onLanguageChanged);
    super.dispose();
  }

  void _onLanguageChanged() {
    if (mounted) {
      setState(() {});
    }
  }

  void _onRoutesChanged() {
    if (mounted) {
      setState(() {});
    }
  }

  //========================================================
  @override
  Widget build(BuildContext context) {
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
        child: PullToRefresh(
          onRefresh: () async {
            await _homepageRoutesController.loadRoutes();
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,

              children: [
                const SizedBox(height: 6),

                //-----------------------------
                // Screen title
                Text(
                  'homepage_title_near_east_buses'.tr,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color:
                        Theme.of(context).textTheme.titleLarge?.color ??
                        Theme.of(context).colorScheme.onBackground,
                  ),
                ),

                //-----------------------------
                const SizedBox(height: 26),

                //-----------------------------
                // The list of routes cards
                if (_homepageRoutesController.loading)
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
                else if (_homepageRoutesController.error != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 24),
                    child: Center(
                      child: Column(
                        children: [
                          Text(
                            _homepageRoutesController.error!,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.onBackground,
                            ),
                          ),
                          const SizedBox(height: 12),
                          OutlinedButton(
                            onPressed: _homepageRoutesController.loadRoutes,
                            child: Text('retry'.tr),
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  Column(
                    children: [
                      for (final route in _homepageRoutesController.routes)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 20),

                          // Each route in the list becomes one UI card.
                          child: ExpandableRouteCard(route: route),
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
            label: 'Routes',
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
