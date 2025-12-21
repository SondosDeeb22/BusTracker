//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import 'package:mobile_app/src/screens/driver/driverProfile.dart';
import 'package:mobile_app/src/screens/driver/homepage_driver.dart';

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

  final List<_DaySchedule> _week = const [
    _DaySchedule(
      day: 'Monday',
      date: '17/03/2026',
      busName: 'Yenikent - Gonyle Bus',
      busColor: Color.fromARGB(255, 2, 13, 167),
    ),
    _DaySchedule(
      day: 'Tuesday',
      date: '18/03/2026',
      busName: 'Yenikent - Gonyle Bus',
      busColor: Color.fromARGB(255, 2, 13, 167),
    ),
    _DaySchedule(
      day: 'Wednesday',
      date: '19/03/2026',
      busName: 'Kizilbas Bus',
      busColor: Color.fromARGB(255, 255, 251, 4),
    ),
    _DaySchedule(
      day: 'Thursday',
      date: '20/03/2026',
      busName: 'Kizilbas Bus',
      busColor: Color.fromARGB(255, 255, 251, 4),
    ),
    _DaySchedule(
      day: 'Friday',
      date: '21/03/2026',
      busName: 'Lefkosa Bus',
      busColor: Color.fromARGB(255, 0, 168, 14),
    ),
    _DaySchedule(
      day: 'Saturday',
      date: '22/03/2026',
      busName: 'Famagusta Bus',
      busColor: Color.fromARGB(255, 0, 227, 204),
    ),
    _DaySchedule(
      day: 'Sunday',
      date: '23/03/2026',
      busName: 'Gonyle 1 Bus',
      busColor: Color.fromARGB(255, 110, 0, 170),
    ),
  ];

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

                const Text(
                  'My Weekly Bus Schedule',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: Colors.black,
                  ),
                ),

                const SizedBox(height: 20),

                // view the routes associated with each day for that driver ---------------------------
                for (final day in _week) ...[
                  _DayScheduleCard(borderColor: _border, schedule: day),

                  const SizedBox(height: 18),
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
}

class _DaySchedule {
  final String day;
  final String date;
  final String busName;
  final Color busColor;

  const _DaySchedule({
    required this.day,
    required this.date,
    required this.busName,
    required this.busColor,
  });
}

PageRoute<void> _noAnimationRoute(Widget page) {
  return PageRouteBuilder<void>(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionDuration: Duration.zero,
    reverseTransitionDuration: Duration.zero,
  );
}

// render card  that contains (day, date , route)=======================================================================

class _DayScheduleCard extends StatelessWidget {
  final Color borderColor;
  final _DaySchedule schedule;

  const _DayScheduleCard({required this.borderColor, required this.schedule});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0x00FFFFFF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor, width: 1),
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // display day and date ========================================================
          Row(
            children: [
              // DAY -----------------------------
              Expanded(
                child: Text(
                  schedule.day,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: Colors.black,
                  ),
                ),
              ),

              // DATE -----------------------------
              Text(
                schedule.date,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: Colors.black,
                ),
              ),
            ],
          ),
          //================================================================================
          const SizedBox(height: 12),

          // display route name in container ------------------
          Container(
            height: 36,
            width: double.infinity,
            decoration: BoxDecoration(
              color: schedule.busColor,
              borderRadius: BorderRadius.circular(10),
            ),

            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.symmetric(horizontal: 16),

            child: Text(
              schedule.busName,
              style: TextStyle(
                color: _textColorFor(schedule.busColor),
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
          ),
          // =====================================================================================
        ],
      ),
    );
  }

  Color _textColorFor(Color bg) {
    final brightness = ThemeData.estimateBrightnessForColor(bg);
    return brightness == Brightness.dark ? Colors.white : Colors.black;
  }
}
