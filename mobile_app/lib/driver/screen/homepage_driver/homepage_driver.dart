//========================================================
//? importing
//========================================================
import 'dart:async';

import 'package:flutter/material.dart';

import '../driver_profile/driver_profile.dart';
import '../bus_schedule/bus_schedule.dart';

import '../../controller/homepage/driver_homepage_header_controller.dart';
import '../../model/homepage/bus_option.dart';
import '../../widget/homepage/tracking_card.dart';
import '../../widget/homepage/welcome_card.dart';

//========================================================
class HomepageDriver extends StatefulWidget {
  const HomepageDriver({super.key});

  @override
  State<HomepageDriver> createState() => _HomepageDriverState();
}

class _HomepageDriverState extends State<HomepageDriver> {
  static const _border = Color(0xFFC9A47A);

  bool _expanded = false;
  bool _paused = false;
  int _bottomIndex = 0;

  final List<BusOption> _buses = const [
    BusOption(name: 'Gonyle 1', color: Color.fromARGB(255, 126, 2, 175)),
    BusOption(name: 'Famagusta', color: Color.fromARGB(255, 0, 227, 204)),
    BusOption(name: 'Lefkosa', color: Color.fromARGB(255, 0, 168, 14)),
    BusOption(
      name: 'Yenikent - Gonyle Bus',
      color: Color.fromARGB(255, 2, 13, 167),
    ),
    BusOption(name: 'Kizilbas', color: Color.fromARGB(255, 255, 251, 4)),
  ];

  late BusOption _currentBus;

  // =========================================================================
  // controller
  final DriverHomepageHeaderController _headerController =
      DriverHomepageHeaderController();

  Timer? _clockTimer;
  DateTime _now = DateTime.now();

  // ---------------------------------------------------
  @override
  void initState() {
    super.initState();
    _currentBus = _buses.first;

    _headerController.addListener(_onHeaderChanged);
    _headerController.fetch();

    _clockTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() {
        _now = DateTime.now();
      });
    });
  }

  @override
  void dispose() {
    _clockTimer?.cancel();
    _headerController.removeListener(_onHeaderChanged);
    super.dispose();
  }

  void _onHeaderChanged() {
    if (!mounted) return;
    setState(() {});
  }

  // ============================================================================================================
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final availableBuses = _buses
        .where((b) => b.name != _currentBus.name)
        .toList();
    final time =
        '${_now.hour.toString().padLeft(2, '0')}:${_now.minute.toString().padLeft(2, '0')}';
    final date =
        '${_now.day.toString().padLeft(2, '0')}/${_now.month.toString().padLeft(2, '0')}/${_now.year}';
    final weekday = _weekdayLabel(_now.weekday);

    final driverName = _headerController.driverName;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,

      // app bar to view logo ---------------------------------------------------
      appBar: AppBar(
        backgroundColor: theme.appBarTheme.backgroundColor,
        elevation: 0,
        toolbarHeight: 100,
        centerTitle: true,
        iconTheme: theme.appBarTheme.iconTheme,
        title: Image.asset(
          'assets/BusLogoWhite.png',
          width: 70,
          height: 70,
          fit: BoxFit.contain,
        ),
      ),

      // ---------------------------------------------------
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 14),
                WelcomeCard(
                  borderColor: _border,
                  driverName: driverName,
                  time: time,
                  date: date,
                  weekday: weekday,
                ),

                // ---------------------------------------------------
                const SizedBox(height: 22),

                // tracking card ---------------------------------------------------
                TrackingCard(
                  borderColor: _border,
                  expanded: _expanded,
                  currentBus: _currentBus,
                  paused: _paused,
                  onToggleExpanded: () {
                    setState(() {
                      _expanded = !_expanded;
                    });
                  },
                  onTogglePaused: (paused) {
                    setState(() {
                      _paused = paused;
                    });
                  },
                  buses: _expanded ? availableBuses : const [],
                  onSelectBus: (bus) {
                    setState(() {
                      _currentBus = bus;
                    });
                  },
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
            ).pushReplacement(_noAnimationRoute(const HomepageDriver()));
            return;
          }

          if (i == 1) {
            Navigator.of(
              context,
            ).pushReplacement(_noAnimationRoute(const BusSchedule()));
            return;
          }

          if (i == 2) {
            Navigator.of(
              context,
            ).pushReplacement(_noAnimationRoute(const DriverProfile()));
            return;
          }

          setState(() {
            _bottomIndex = i;
          });
        },
        type: BottomNavigationBarType.fixed,
        backgroundColor: theme.bottomNavigationBarTheme.backgroundColor ??
            theme.appBarTheme.backgroundColor,
        selectedItemColor:
            theme.bottomNavigationBarTheme.selectedItemColor ?? cs.secondary,
        unselectedItemColor:
            theme.bottomNavigationBarTheme.unselectedItemColor ?? cs.onPrimary,
        showSelectedLabels: false,
        showUnselectedLabels: false,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: 'Home',
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month_outlined),
            label: 'Calendar',
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
        ],
      ),
      //===========================================================================================
    );
  }

  //----------------------------------------------------------------------------------------
  String _weekdayLabel(int weekday) {
    switch (weekday) {
      case DateTime.monday:
        return 'Monday';
      case DateTime.tuesday:
        return 'Tuesday';
      case DateTime.wednesday:
        return 'Wednesday';
      case DateTime.thursday:
        return 'Thursday';
      case DateTime.friday:
        return 'Friday';
      case DateTime.saturday:
        return 'Saturday';
      case DateTime.sunday:
        return 'Sunday';
      default:
        return '';
    }
  }
}
//----------------------------------------------------------------------------------------

PageRoute<void> _noAnimationRoute(Widget page) {
  return PageRouteBuilder<void>(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionDuration: Duration.zero,
    reverseTransitionDuration: Duration.zero,
  );
}
