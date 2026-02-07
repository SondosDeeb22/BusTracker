//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../../controller/schedule/weekly_bus_schedule/weekly_bus_schedule_controller.dart';
import '../../service/localization/localization_service.dart';

import '../../widget/schedule/weekly_bus_schedule/weekly_schedule_day_header.dart';
import '../../widget/schedule/weekly_bus_schedule/weekly_schedule_trip_card.dart';
import '../driver_profile/driver_profile.dart';
import '../homepage_driver/homepage_driver.dart';

//========================================================
class WeeklyBusSchedule extends StatefulWidget {
  const WeeklyBusSchedule({super.key});

  @override
  State<WeeklyBusSchedule> createState() => _WeeklyBusScheduleState();
}

class _WeeklyBusScheduleState extends State<WeeklyBusSchedule> {
  static const _burgundy = Color(0xFF59011A);
  static const _bg = Color(0xFFF2F1ED);
  static const _border = Color(0xFFC9A47A);

  int _bottomIndex = 1;

  final DriverWeeklyBusScheduleController _controller =
      DriverWeeklyBusScheduleController();

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
    return Scaffold(
      backgroundColor: _bg,

      // app bar to view logo ---------------------------------------------------
      appBar: AppBar(
        backgroundColor: _burgundy,
        elevation: 0,
        toolbarHeight: 100,
        centerTitle: true,
        iconTheme: const IconThemeData(color: _bg),
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
            padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 6),

                Text(
                  'driver_weekly_schedule_title'.translate,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: Colors.black,
                  ),
                ),

                const SizedBox(height: 20),

                if (_controller.isLoading) ...[
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 22),
                      child: CircularProgressIndicator(color: _burgundy),
                    ),
                  ),
                ] else ...[
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
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: Colors.black,
                        ),
                      ),
                    ),
                  ],

                  for (final day in _controller.days) ...[
                    WeeklyScheduleDayHeader(day: day.day, date: day.date),
                    const SizedBox(height: 12),

                    for (final trip in day.scheduleDetails) ...[
                      WeeklyScheduleTripCard(
                        borderColor: _border,
                        time: trip.time,
                        busText: _busText(trip.busId, trip.busPlate),
                        routeName: trip.routeName,
                        routeColor: trip.routeColor,
                      ),
                      const SizedBox(height: 18),
                    ],

                    const SizedBox(height: 6),
                  ],
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
