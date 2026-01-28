//========================================================
//? importing
//========================================================
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:app_links/app_links.dart';
import 'driver/screen/auth/login/login_page.dart';
import 'driver/screen/auth/reset_password/reset_password.dart';
import 'driver/service/localization/localization_service.dart';

//========================================================

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await DriverLocalizationService().init();

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

  final GlobalKey<NavigatorState> _navigatorKey = GlobalKey<NavigatorState>();
  StreamSubscription? _linkSub;
  late final AppLinks _appLinks;

  @override
  void initState() {
    super.initState();
    _localizationService.addListener(_onLanguageChanged);

    _appLinks = AppLinks();
    _initDeepLinks();
  }

  @override
  void dispose() {
    _localizationService.removeListener(_onLanguageChanged);

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
    // Expected: myapp://reset-password/<token>
    if (uri.scheme != 'myapp') return;

    String? token;

    // Variant A (recommended): myapp://reset-password/<token>
    if (uri.host == 'reset-password') {
      if (uri.pathSegments.isNotEmpty) {
        token = uri.pathSegments.first.trim();
      }
    }

    // Variant B (tolerated): myapp://some-host/reset-password/<token>
    if (token == null) {
      final segments = uri.pathSegments;
      if (segments.length >= 2 && segments.first == 'reset-password') {
        token = segments[1].trim();
      }
    }

    if (token == null || token.isEmpty) return;
    final nonNullToken = token;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _navigatorKey.currentState?.push(
        MaterialPageRoute(
          builder: (_) => ResetPasswrodPage(token: nonNullToken),
        ),
      );
    });
  }

  void _onLanguageChanged() {
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

      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF59011A)),
      ),
    );
  }
}
