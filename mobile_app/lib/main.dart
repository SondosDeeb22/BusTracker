//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'user/screen/cover_page_user/cover_page_user.dart';
import 'services/localization_service.dart';
import 'services/theme_service.dart';

//========================================================

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize services
  await LocalizationService().init();
  await ThemeService().init();

  runApp(const MyApp());
}

//========================================================

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

//========================================================================================================================

class _MyAppState extends State<MyApp> {
  //? Services
  final LocalizationService _localizationService = LocalizationService();
  final ThemeService _themeService = ThemeService();

  //========================================================================================================================


  @override
  void initState() {
    super.initState();
    // Listen for changes
    _localizationService.addListener(_onLanguageChanged);
    _themeService.addListener(_onThemeChanged);
  }

  // ------------------------------------------

  @override
  void dispose() {
    _localizationService.removeListener(_onLanguageChanged);
    _themeService.removeListener(_onThemeChanged);
    super.dispose();
  }

  //========================================================================================================================
  // Language change listener 

  void _onLanguageChanged() {
    if (mounted) {
      setState(() {});
    }
  }

  // ------------------------------------------

  // Theme change listener
  void _onThemeChanged() {
    print('MainApp: Theme change detected! Rebuilding app.');
    if (mounted) {
      setState(() {});
    }
  }

  //========================================================================================================================

  // Build method
  @override
  Widget build(BuildContext context) {
    print('MainApp: Building with theme mode: ${_themeService.themeMode}');
    return MaterialApp(
      title: 'NEU Bus Tracker',
      debugShowCheckedModeBanner: false,

      // Localization configuration
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', 'US'), // English
        Locale('tr', 'TR'), // Turkish
      ],
      locale: Locale(_localizationService.currentLanguage),

      // Theme configuration
      theme: _themeService.lightTheme,
      darkTheme: _themeService.darkTheme,
      themeMode: _themeService.themeMode, // the theme who gets applied 

      home: const CoverPage(),
    );
  }
}
