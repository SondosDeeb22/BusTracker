//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import '../../screen/account_settings_user/account_settings_user.dart';
import '../homepage_user/homepage_user.dart';
import '../../controller/bus_schedule_controller.dart';
import '../../../services/localization_service.dart';
import '../../widget/schedule/day_selector_card.dart';
import '../../widget/schedule/service_pattern_section.dart';

//========================================================

class BusScheduleUser extends StatefulWidget {
  const BusScheduleUser({super.key});

  @override
  State<BusScheduleUser> createState() => _BusScheduleUserState();
}

//========================================================

class _BusScheduleUserState extends State<BusScheduleUser> {
  final BusScheduleController _controller = BusScheduleController();
  final LocalizationService _localizationService = LocalizationService();

  int _bottomIndex = 1;

  //========================================================

  @override
  void initState() {
    super.initState();

    _controller.addListener(_onControllerChanged);
    _controller.loadSchedule();

    // Listen for language changes to rebuild UI
    _localizationService.addListener(_onLanguageChanged);
  }

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
    final selectedDay = _controller.selectedDay;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,

      // Building Top Bar =======================================================================================
      appBar: AppBar(
        backgroundColor: colorScheme.primary,
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
            icon: Icon(Icons.settings, color: colorScheme.onPrimary),
          ),
        ],
      ),

      //=======================================================================================
      // View schedule
      body: SafeArea(
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
                  'bus_schedule_title'.tr,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: colorScheme.onSurface,
                  ),
                ),

                //-----------------------------
                const SizedBox(height: 18),

                //-----------------------------
                if (_controller.loading)
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
                //_____________________
                else if (_controller.error != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 24),
                    child: Center(
                      child: Column(
                        children: [
                          Text(
                            _controller.error!,
                            textAlign: TextAlign.center,
                            style: TextStyle(color: colorScheme.onSurface),
                          ),
                          const SizedBox(height: 12),
                          OutlinedButton(
                            onPressed: _controller.loadSchedule,
                            child: Text('retry'.tr),
                          ),
                        ],
                      ),
                    ),
                  )
                //_____________________
                else if (_controller.days.isEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 24),
                    child: Center(
                      child: Text(
                        'bus_schedule_no_data'.tr,
                        style: TextStyle(color: colorScheme.onSurface),
                      ),
                    ),
                  )
                //_____________________
                // display schedule data
                else ...[
                  if (selectedDay != null)
                    DaySelectorCard(
                      dayLabel: _controller.dayKeyToLabel(selectedDay.dayKey),
                      date: selectedDay.date,
                      onTap: () {
                        _openDayPicker(context);
                      },
                    ),

                  //-----------------------------
                  const SizedBox(height: 18),

                  //-----------------------------
                  // Service patterns (tabs) and times grid
                  if (selectedDay != null)
                    for (
                      int i = 0;
                      i < selectedDay.servicePatterns.length;
                      i++
                    ) ...[
                      ServicePatternSection(
                        servicePattern: selectedDay.servicePatterns[i],
                        selectedRouteIndex: _controller
                            .selectedRouteIndexForServicePattern(i),
                        onSelectRoute: (routeIndex) {
                          _controller.selectRoute(i, routeIndex);
                        },
                      ),
                      if (i != selectedDay.servicePatterns.length - 1)
                        const SizedBox(height: 48),
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
        backgroundColor: colorScheme.primary,
        selectedItemColor: colorScheme.secondary,
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

  //========================================================

  // Opens a bottom sheet for selecting the schedule day.
  // After selection, controller state is updated and the sheet closes.
  void _openDayPicker(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      builder: (ctx) {
        final colorScheme = Theme.of(ctx).colorScheme;

        return SafeArea(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              // Limit the bottom sheet height so it can scroll when content is long
              maxHeight: MediaQuery.of(ctx).size.height * 0.7,
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // header -------------------------------------------------
                  // Title + cancel action
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 18,
                      vertical: 14,
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            'select_day'.tr,
                            style: TextStyle(
                              fontWeight: FontWeight.w700,
                              color: colorScheme.onSurface,
                            ),
                          ),
                        ),
                        TextButton(
                          onPressed: () => Navigator.of(ctx).pop(),
                          child: Text('cancel'.tr),
                        ),
                      ],
                    ),
                  ),

                  // list ---------------------------------------------------
                  // Shows all available schedule days
                  for (int i = 0; i < _controller.days.length; i++)
                    ListTile(
                      title: Text(
                        _controller.dayKeyToLabel(_controller.days[i].dayKey),
                        style: TextStyle(color: colorScheme.onSurface),
                      ),
                      subtitle: Text(
                        _controller.days[i].date,
                        style: TextStyle(color: colorScheme.onSurface),
                      ),
                      trailing: i == _controller.selectedDayIndex
                          ? Icon(Icons.check, color: colorScheme.primary)
                          : null,
                      onTap: () {
                        // Update the selected day and close the bottom sheet
                        _controller.selectDay(i);
                        Navigator.of(ctx).pop();
                      },
                    ),

                  const SizedBox(height: 10),
                ],
              ),
            ),
          ),
        );
      },
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
