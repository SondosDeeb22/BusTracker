//========================================================
//? importing
//========================================================
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'driver/service/localization/localization_service.dart';
import 'services/theme_service.dart';
import 'package:app_links/app_links.dart';

import 'driver/screen/auth/login/login_page.dart';

import 'driver/screen/auth/reset_password/reset_password.dart';
import 'driver/screen/auth/reset_password/invalid_reset_link_page.dart';

import 'driver/screen/auth/set_password/set_password.dart';
import 'driver/screen/auth/set_password/invalid_set_password_link_page.dart';
import 'driver/service/auth/set_password/set_password_service.dart';

import 'driver/service/auth/reset_password/reset_password_service.dart';




//========================================================

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await DriverLocalizationService().init();
  await ThemeService().init();

  runApp(const DriverApp());
}

//========================================================

class DriverApp extends StatefulWidget {
  const DriverApp({super.key});

  @override
  State<DriverApp> createState() => _DriverAppState();
}

class _DriverAppState extends State<DriverApp> {
  final DriverLocalizationService _localizationService =
      DriverLocalizationService();

  final ThemeService _themeService = ThemeService();

  final GlobalKey<NavigatorState> _navigatorKey = GlobalKey<NavigatorState>();
  StreamSubscription? _linkSub;
  late final AppLinks _appLinks;

  @override
  void initState() {
    super.initState();
    _localizationService.addListener(_onLanguageChanged);
    _themeService.addListener(_onThemeChanged);

    _appLinks = AppLinks();
    _initDeepLinks();
  }

  @override
  void dispose() {
    _localizationService.removeListener(_onLanguageChanged);
    _themeService.removeListener(_onThemeChanged);

    _linkSub?.cancel();
    super.dispose();
  }

  //========================================================

  Future<void> _initDeepLinks() async {
    // Handle the app being opened via a link
    try {
      final initial = await _appLinks.getInitialLink();
      if (initial != null) {
        _handleIncomingUri(initial);
      }
    } catch (_) {
      // ignore
    }

    // Handle links while the app is running
    _linkSub = _appLinks.uriLinkStream.listen(
      (Uri uri) {
        _handleIncomingUri(uri);
      },
      onError: (_) {
        // ignore
      },
    );
  }

  void _handleIncomingUri(Uri uri) {
    // Expected:
    // - myapp://reset-password/<token>
    // - myapp://set-password/<token>
    if (uri.scheme != 'myapp') return;

    String? token;
    String? type;

    // Variant A (recommended): myapp://reset-password/<token>
    if (uri.host == 'reset-password') {
      if (uri.pathSegments.isNotEmpty) {
        token = uri.pathSegments.first.trim();
        type = 'reset-password';
      }
    }

    if (uri.host == 'set-password') {
      if (uri.pathSegments.isNotEmpty) {
        token = uri.pathSegments.first.trim();
        type = 'set-password';
      }
    }

    // Variant B (tolerated): myapp://some-host/reset-password/<token>
    if (token == null) {
      final segments = uri.pathSegments;
      if (segments.length >= 2 && segments.first == 'reset-password') {
        token = segments[1].trim();
        type = 'reset-password';
      }
    }

    if (token == null) {
      final segments = uri.pathSegments;
      if (segments.length >= 2 && segments.first == 'set-password') {
        token = segments[1].trim();
        type = 'set-password';
      }
    }

    if (token == null || token.isEmpty) return;
    final nonNullToken = token;
    final nonNullType = type;
    if (nonNullType == null) return;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      Future<void>(() async {
        late final MaterialPageRoute route;

        if (nonNullType == 'reset-password') {
          final service = ResetPasswordService();
          final errorKeyOrMessage = await service.validateResetPasswordToken(
            token: nonNullToken,
          );
          route = (errorKeyOrMessage == null)
              ? MaterialPageRoute(
                  builder: (_) => ResetPasswrodPage(token: nonNullToken),
                )
              : MaterialPageRoute(builder: (_) => const InvalidResetLinkPage());
        } else {
          final service = SetPasswordService();
          final errorKeyOrMessage = await service.validateSetPasswordToken(
            token: nonNullToken,
          );
          route = (errorKeyOrMessage == null)
              ? MaterialPageRoute(
                  builder: (_) => SetPasswordPage(token: nonNullToken),
                )
              : MaterialPageRoute(
                  builder: (_) => const InvalidSetPasswordLinkPage(),
                );
        }

        _navigatorKey.currentState?.pushReplacement(route);
      });
    });
  }

  void _onLanguageChanged() {
    if (mounted) {
      setState(() {});
    }
  }

  void _onThemeChanged() {
    if (mounted) {
      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NEU Bus Tracker - Driver',
      home: const LoginPage(),
      debugShowCheckedModeBanner: false,

      navigatorKey: _navigatorKey,

      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [Locale('en', 'US'), Locale('tr', 'TR')],
      locale: Locale(_localizationService.currentLanguage),

      theme: _themeService.lightTheme,
      darkTheme: _themeService.darkTheme,
      themeMode: _themeService.themeMode,
    );
  }
}
