//========================================================
 //? importing
 //========================================================
 import 'package:flutter/material.dart';

//========================================================

/// Helper: disable page transition animations for bottom nav
PageRoute<void> noAnimationRoute(Widget page) {
  return PageRouteBuilder<void>(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionDuration: Duration.zero,
    reverseTransitionDuration: Duration.zero,
  );
}
