//========================================================
 //? importing
 //========================================================
 import 'package:flutter/material.dart';
 import '../../screen/account_settings_user/account_settings_user.dart';

//========================================================

/// Reusable app bar with logo and settings icon for user screens
class UserAppBar extends StatelessWidget implements PreferredSizeWidget {
  const UserAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return AppBar(
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
          icon: Icon(
            Icons.settings,
            color: colorScheme.onPrimary,
          ),
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(100);
}
