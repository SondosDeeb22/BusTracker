//========================================================
 //? importing
 //========================================================
 import 'package:flutter/material.dart';
 import '../../../../services/localization_service.dart';

//========================================================

/// Reusable day picker bottom sheet for schedule screens
class DayPickerBottomSheet extends StatelessWidget {
  final List<String> dayLabels;
  final List<String> dayDates;
  final int selectedIndex;
  final ValueChanged<int> onDaySelected;

  const DayPickerBottomSheet({
    super.key,
    required this.dayLabels,
    required this.dayDates,
    required this.selectedIndex,
    required this.onDaySelected,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return SafeArea(
      child: ConstrainedBox(
        constraints: BoxConstraints(
          // Limit the bottom sheet height so it can scroll when content is long
          maxHeight: MediaQuery.of(context).size.height * 0.7,
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
                      onPressed: () => Navigator.of(context).pop(),
                      child: Text(
                        'cancel'.tr,
                        style: TextStyle(
                          color: colorScheme.onSurface,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // list ---------------------------------------------------
              // Shows all available schedule days
              for (int i = 0; i < dayLabels.length; i++)
                ListTile(
                  title: Text(
                    dayLabels[i],
                    style: TextStyle(color: colorScheme.onSurface),
                  ),
                  subtitle: Text(
                    dayDates[i],
                    style: TextStyle(color: colorScheme.onSurface),
                  ),
                  trailing: i == selectedIndex
                      ? Icon(Icons.check, color: colorScheme.onSurface)
                      : null,
                  onTap: () {
                    // Update the selected day and close the bottom sheet
                    onDaySelected(i);
                    Navigator.of(context).pop();
                  },
                ),

              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }
}
