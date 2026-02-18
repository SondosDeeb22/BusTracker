//========================================================
 //? importing
 //========================================================
 import 'package:flutter/material.dart';
 
//========================================================
 
/// Reusable bottom navigation bar for user screens
class UserBottomNavigationBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const UserBottomNavigationBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
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
          label: 'Routes',
        ),
        // icon for Bus Schedule -------------------------------------------------
        BottomNavigationBarItem(
          icon: Icon(Icons.calendar_month_outlined),
          label: 'Schedule',
        ),
      ],
    );
  }
}
