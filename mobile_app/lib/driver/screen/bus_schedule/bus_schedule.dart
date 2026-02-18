//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../../controller/schedule/bus_schedule/bus_schedule_controller.dart';
import '../../service/localization/localization_service.dart';

import '../../widget/schedule/bus_schedule/schedule_day_header.dart';
import '../../widget/schedule/bus_schedule/schedule_trip_card.dart';
import '../driver_profile/driver_profile.dart';
import '../homepage_driver/homepage_driver.dart';
import '../../../common/pull_to_refresh.dart';

//========================================================
class BusSchedule extends StatefulWidget {
  const BusSchedule({super.key});

  @override
  State<BusSchedule> createState() => _BusScheduleState();
}

class _BusScheduleState extends State<BusSchedule> {
  static const _burgundy = Color(0xFF59011A);
  static const _border = Color(0xFFC9A47A);

  int _bottomIndex = 1;

  final Set<String> _expandedDays = <String>{};

  final DriverBusScheduleController _controller = DriverBusScheduleController();

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onControllerChanged);
    _controller.fetch();
  }

  void _onControllerChanged() {
    if (!mounted) return;
    setState(() {});
  }

  @override
  void dispose() {
    _controller.removeListener(_onControllerChanged);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

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
        child: PullToRefresh(
          onRefresh: () async {
            await _controller.fetch();
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 6),

                // My Bus Schedule (screen t) ----------------
                Text(
                  'driver_schedule_title'.translate,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w800,
                    color: cs.onBackground,
                  ),
                ),

                const SizedBox(height: 20),

                // view the schedule ----------------------------------------------
                if (_controller.isLoading) ...[
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 22),
                      child: CircularProgressIndicator(color: _burgundy),
                    ),
                  ),
                  
                ] else ...[
                  // view error message if error occured or no schedule found ----------------------------------------------
                  if (_controller.errorMessage != null &&
                      _controller.errorMessage!.trim().isNotEmpty) ...[
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 14,
                      ),
                      
                      decoration: BoxDecoration(
                        color: const Color(0x00FFFFFF),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: _border, width: 1),
                      ),
                      
                      child: Text(
                        _controller.errorMessage!,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: cs.onBackground,
                        ),
                      ),
                    ),
                  ],

                  // view schedule ---------------------------------------------------
                  // (if we had empty array , no error will be raised, and no widgets'll be redered)
                  ..._controller.days.expand(_buildDaySectionWidgets),
                ],
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
        backgroundColor: _burgundy,
        selectedItemColor: _border,
        unselectedItemColor: Colors.white,
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
    );
  }

  //========================================================

  Iterable<Widget> _buildDaySectionWidgets(dynamic day) {
    final dayKey = '${day.day}|${day.date}';
    final isExpanded = _expandedDays.contains(dayKey);
    final details = day.scheduleDetails;

    return <Widget>[
      ScheduleDayHeader(
        day: day.day,
        date: day.date,
        isExpanded: isExpanded,
        onToggle: () {
          setState(() {
            if (isExpanded) {
              _expandedDays.remove(dayKey);
            } else {
              _expandedDays.add(dayKey);
            }
          });
        },
      ),
      const SizedBox(height: 12),
      
      AnimatedSize(
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeInOut,
        alignment: Alignment.topCenter,
        clipBehavior: Clip.hardEdge,
        child: Column(
          children: [
            if (isExpanded && details.isNotEmpty) ...[
              for (final trip in details) ...[
                ScheduleTripCard(
                  borderColor: _border,
                  time: trip.time,
                  busText: _busText(trip.busId, trip.busPlate),
                  routeName: trip.routeName,
                  routeColor: trip.routeColor,
                ),
                const SizedBox(height: 18),
              ],
            ]
          ],
        ),
      ),
      const SizedBox(height: 6),
    ];
  }

  // ========================================================================
  
  // function to get bus text 
  String _busText(String busId, String busPlate) {
    final id = busId.trim();
    final plate = busPlate.trim();

    if (id.isEmpty && plate.isEmpty) return '';
    if (id.isEmpty) return plate;
    if (plate.isEmpty) return id;
    return '$id  $plate';
  }

  // ----------------------------------------------------------
}

PageRoute<void> _noAnimationRoute(Widget page) {
  return PageRouteBuilder<void>(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionDuration: Duration.zero,
    reverseTransitionDuration: Duration.zero,
  );
}
