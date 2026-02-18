//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import '../homepage_user/homepage_user.dart';

import '../../controller/bus_schedule_controller.dart';
import '../../../services/localization_service.dart';

import '../../widget/schedule/day_selector_card.dart';
import '../../widget/schedule/service_pattern_section.dart';

import '../../widget/common/state_widgets.dart';
import '../../widget/common/user_bottom_navigation.dart';
import '../../widget/common/user_app_bar.dart';

import '../../widget/schedule/day_picker_bottom_sheet.dart';

import '../../../common/pull_to_refresh.dart';
import '../../../common/utils/navigation_utils.dart';

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
      appBar: const UserAppBar(),

      //=======================================================================================
      // View schedule
      body: SafeArea(
        child: PullToRefresh(
          onRefresh: () async {
            await _controller.loadSchedule();
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
                  const LoadingStateWidget()
                //_____________________
                else if (_controller.error != null)
                  ErrorStateWidget(
                    error: _controller.error!,
                    onRetry: _controller.loadSchedule,
                  )
                //_____________________
                else if (_controller.days.isEmpty)
                  EmptyStateWidget(message: 'bus_schedule_no_data'.tr)
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
      bottomNavigationBar: UserBottomNavigationBar(
        currentIndex: _bottomIndex,
        onTap: (i) {
          if (i == _bottomIndex) return;

          if (i == 0) {
            Navigator.of(context).pushReplacement(noAnimationRoute(const HomepageUser()));
            return;
          }

          if (i == 1) {
            Navigator.of(context).pushReplacement(noAnimationRoute(const BusScheduleUser()));
            return;
          }

          setState(() {
            _bottomIndex = i;
          });
        },
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
        return DayPickerBottomSheet(
          dayLabels: _controller.days.map((day) => _controller.dayKeyToLabel(day.dayKey)).toList(),
          dayDates: _controller.days.map((day) => day.date).toList(),
          selectedIndex: _controller.selectedDayIndex,
          onDaySelected: _controller.selectDay,
        );
      },
    );
  }
}

