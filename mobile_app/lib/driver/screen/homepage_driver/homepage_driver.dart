//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../driver_profile/driver_profile.dart';
import '../bus_schedule/bus_schedule.dart';

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

  final List<_BusOption> _buses = const [
    _BusOption(name: 'Gonyle 1', color: Color.fromARGB(255, 126, 2, 175)),
    _BusOption(name: 'Famagusta', color: Color.fromARGB(255, 0, 227, 204)),
    _BusOption(name: 'Lefkosa', color: Color.fromARGB(255, 0, 168, 14)),
    _BusOption(
      name: 'Yenikent - Gonyle Bus',
      color: Color.fromARGB(255, 2, 13, 167),
    ),
    _BusOption(name: 'Kizilbas', color: Color.fromARGB(255, 255, 251, 4)),
  ];

  late _BusOption _currentBus;

  // ---------------------------------------------------
  @override
  void initState() {
    super.initState();
    _currentBus = _buses.first;
  }

  // ============================================================================================================
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final availableBuses = _buses
        .where((b) => b.name != _currentBus.name)
        .toList();
    final now = DateTime.now();
    final time =
        '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
    final date =
        '${now.day.toString().padLeft(2, '0')}/${now.month.toString().padLeft(2, '0')}/${now.year}';
    final weekday = _weekdayLabel(now.weekday);

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
                _WelcomeCard(
                  borderColor: _border,
                  time: time,
                  date: date,
                  weekday: weekday,
                ),

                // ---------------------------------------------------
                const SizedBox(height: 22),

                // tracking card ---------------------------------------------------
                _TrackingCard(
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

// =========================================================================================
class _BusOption {
  final String name;
  final Color color;

  const _BusOption({required this.name, required this.color});
}

PageRoute<void> _noAnimationRoute(Widget page) {
  return PageRouteBuilder<void>(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionDuration: Duration.zero,
    reverseTransitionDuration: Duration.zero,
  );
}

// design welcoming card ( name - time, date, day )=========================================================================================
class _WelcomeCard extends StatelessWidget {
  final Color borderColor;
  final String time;
  final String date;
  final String weekday;

  const _WelcomeCard({
    required this.borderColor,
    required this.time,
    required this.date,
    required this.weekday,
  });

  //----------------------------------------------------------------------------------------
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0x00FFFFFF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor, width: 1),
      ),

      // build the first widget (welcoming box )====================================================================================================================
      child: Column(
        children: [
          // welcome driver and photo  ----------------------------------------------------------------
          Row(
            children: [
              Expanded(
                child: Text(
                  'Welcome , Adam',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: cs.onBackground,
                  ),
                ),
              ),

              //----------------------------------------------------------------------------------------
              Container(
                width: 44,
                height: 44,
                decoration: const BoxDecoration(
                  color: Color(0xFFD9D9D9),
                  shape: BoxShape.circle,
                ),

                // driver photot (anonymous pic by default) ----------------------------------------------------------------------------------------
                child: const Icon(Icons.person, color: Colors.white),
              ),
            ],
          ),
          //----------------------------------------------------------------------------------------

          //-----------------------------
          const SizedBox(height: 12),

          // divider line----------------------------------------------------------------------------------------
          Container(height: 1, width: double.infinity, color: borderColor),

          //------------------------------
          const SizedBox(height: 12),

          // view (time, date, day) ----------------------------------------------------------------------------------------
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // TIME -------------------
              Text(
                time,
                style: theme.textTheme.bodySmall?.copyWith(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: cs.onBackground,
                ),
              ),

              // DATE -------------------
              Text(
                date,
                style: theme.textTheme.bodySmall?.copyWith(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: cs.onBackground,
                ),
              ),

              // DAY -------------------
              Text(
                weekday,
                style: theme.textTheme.bodySmall?.copyWith(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: cs.onBackground,
                ),
              ),
            ],
          ),
          //----------------------------------------------------------------------------------------
        ],
      ),
    );
  }
}

// disply the Tracking Status Card =====================================================================================

class _TrackingCard extends StatelessWidget {
  final Color borderColor;
  final bool expanded;
  final _BusOption currentBus;
  final bool paused;
  final VoidCallback onToggleExpanded;
  final ValueChanged<bool> onTogglePaused;
  final List<_BusOption> buses;
  final ValueChanged<_BusOption> onSelectBus;

  const _TrackingCard({
    required this.borderColor,
    required this.expanded,
    required this.currentBus,
    required this.paused,
    required this.onToggleExpanded,
    required this.onTogglePaused,
    required this.buses,
    required this.onSelectBus,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0x00FFFFFF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor, width: 1),
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // -----------------------------------------------------------------------------------------
          Row(
            children: [
              Expanded(
                child: Text(
                  'Tracking Status',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: cs.onBackground,
                  ),
                ),
              ),

              // widget to change the "expanded" status of the trakcing box-------------------------------
              InkWell(
                onTap: onToggleExpanded,
                child: Container(
                  width: 26,
                  height: 26,
                  decoration: BoxDecoration(
                    color: cs.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: cs.outlineVariant),
                  ),

                  // display arrow icon in the tracking box (according to expanded status) -------------------------------
                  child: Icon(
                    expanded
                        ? Icons.keyboard_arrow_up
                        : Icons.keyboard_arrow_down,
                    color: cs.onSurface,
                  ),
                ),
              ),
            ],
          ),

          // -----------------------------------------------------------------------------------------
          const SizedBox(height: 10),

          // dividor in tracking box ==========================================================================
          Container(height: 1, width: double.infinity, color: borderColor),

          //-------------------------------
          const SizedBox(height: 12),

          // view the current bus title and color =======================================================
          Container(
            height: 40,
            width: double.infinity,
            decoration: BoxDecoration(
              color: currentBus.color,
              borderRadius: BorderRadius.circular(10),
            ),
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: Text(
              currentBus.name,
              style: TextStyle(
                color: _textColorFor(currentBus.color),
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
          ),
          //========================================================================================

          //-------------------------------
          const SizedBox(height: 12),

          // display the tracking status toggle -------------------------------
          _StatusToggle(
            borderColor: const Color(0xFFE7D7C2),
            leftSelected: !paused,
            onChanged: (leftSelected) => onTogglePaused(!leftSelected),
          ),
          //-------------------------------

          // if tracking status box was expanded, we display the routes title  using  _BusSelectRow
          if (expanded) ...[
            const SizedBox(height: 16),

            for (final bus in buses) ...[
              _BusSelectRow(bus: bus, onSelect: () => onSelectBus(bus)),

              const SizedBox(height: 12),
            ],
          ],
        ],
      ),
    );
  }

  // Estimate brightness to pick readable text color.
  // Dark background => white text, light background => black text
  Color _textColorFor(Color bg) {
    final brightness = ThemeData.estimateBrightnessForColor(bg);
    return brightness == Brightness.dark ? Colors.white : Colors.black;
  }
}

// Control the Tracking Status Toggle ==================================================================================================

class _StatusToggle extends StatelessWidget {
  final Color borderColor;
  final bool leftSelected;
  final ValueChanged<bool> onChanged;

  const _StatusToggle({
    required this.borderColor,
    required this.leftSelected,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Container(
      height: 70,
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),

      child: Row(
        children: [
          // control the left-side of the toggle (Operating) ---------------------------------------------------------------
          Expanded(
            child: InkWell(
              onTap: () => onChanged(true),
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: leftSelected
                      ? const Color(0xFF59011A)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),

                child: Text(
                  'Operating',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: leftSelected ? cs.onPrimary : cs.onSurface,
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(width: 10),

          // control the right-side of the toggle (Paused) ---------------------------------------------------------------
          Expanded(
            child: InkWell(
              onTap: () => onChanged(false),
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: leftSelected
                      ? Colors.transparent
                      : const Color(0xFFC9B08A),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  'Paused',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: cs.onSurface,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// display: (route title + color ) ( select ) in row ========this is used if expanded arrow was opend in tracking status card ============================================================================================

class _BusSelectRow extends StatelessWidget {
  final _BusOption bus;
  final VoidCallback onSelect;

  const _BusSelectRow({required this.bus, required this.onSelect});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // view the route title and color ---------------------------------------------------------------------
        Expanded(
          child: Container(
            height: 34,

            decoration: BoxDecoration(
              color: bus.color,
              borderRadius: BorderRadius.circular(8),
            ),

            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.symmetric(horizontal: 14),

            child: Text(
              bus.name,
              style: TextStyle(
                color: _textColorFor(bus.color),
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
          ),
        ),

        const SizedBox(width: 10),

        // view "Select" button for each route ---------------------------------------------------------------
        SizedBox(
          width: 70,
          height: 34,
          child: OutlinedButton(
            onPressed: onSelect,
            style: OutlinedButton.styleFrom(
              backgroundColor: const Color(0xFFF5EFE6),
              side: const BorderSide(color: Color(0xFFE4D4BF)),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              padding: EdgeInsets.zero,
            ),
            child: const Text(
              'Select',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Color _textColorFor(Color bg) {
    final brightness = ThemeData.estimateBrightnessForColor(bg);
    return brightness == Brightness.dark ? Colors.white : Colors.black;
  }
}
