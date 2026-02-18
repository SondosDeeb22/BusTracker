//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//========================================================
//? Reusable pull-to-refresh wrapper
//========================================================

class PullToRefresh extends StatelessWidget {
  final Future<void> Function() onRefresh;
  final Widget child;
  final Color? color;

  const PullToRefresh({
    super.key,
    required this.onRefresh,
    required this.child,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      color: color ?? Theme.of(context).colorScheme.secondary,
      onRefresh: onRefresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),//so it works even when the content is short
        child: child,
      ),
    );
  }
}
