//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../homepage_driver/homepage_driver.dart';
import '../bus_schedule/bus_schedule.dart';

import '../../controller/profile/driver_profile_controller.dart';

import '../../service/localization/localization_service.dart';
import '../../service/user_preferences_service.dart';
import '../../../services/theme_service.dart';

import '../../widget/profile/section_card.dart';
import '../../widget/profile/settings_toggle.dart';
import '../../widget/profile/info_row.dart';
import '../../widget/profile/edit_phone_dialog.dart';

//========================================================

class DriverProfile extends StatefulWidget {
  const DriverProfile({super.key});

  @override
  State<DriverProfile> createState() => _DriverProfileState();
}

class _DriverProfileState extends State<DriverProfile> {
  static const _burgundy = Color(0xFF59011A);
  static const _border = Color(0xFFC9A47A);

  int _bottomIndex = 2;

  bool _englishSelected = true;
  bool _lightSelected = true;

  // =========================================================================
  // controller
  final DriverProfileController _controller = DriverProfileController();
  final UserPreferencesService _prefs = UserPreferencesService();
  final ThemeService _themeService = ThemeService();

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onControllerChanged);
    _controller.fetch();
    _loadPreferences();

    DriverLocalizationService().addListener(_onLanguageChanged);
    _themeService.addListener(_onThemeChanged);
  }

  // Load saved preferences
  Future<void> _loadPreferences() async {
    final englishSelected = DriverLocalizationService().currentLanguage == 'en';
    final lightSelected = _themeService.isLight;
    
    if (mounted) {
      setState(() {
        _englishSelected = englishSelected;
        _lightSelected = lightSelected;
      });
    }
  }

  @override
  void dispose() {
    _controller.removeListener(_onControllerChanged);
    DriverLocalizationService().removeListener(_onLanguageChanged);
    _themeService.removeListener(_onThemeChanged);
    super.dispose();
  }

  void _onControllerChanged() {
    if (!mounted) return;
    setState(() {});
  }

  void _onLanguageChanged() {
    if (!mounted) return;
    final isEnglish = DriverLocalizationService().currentLanguage == 'en';
    if (_englishSelected != isEnglish) {
      setState(() {
        _englishSelected = isEnglish;
      });
    } else {
      setState(() {});
    }
  }

  void _onThemeChanged() {
    if (!mounted) return;
    final isLight = _themeService.isLight;
    if (_lightSelected != isLight) {
      setState(() {
        _lightSelected = isLight;
      });
    } else {
      setState(() {});
    }
  }

  // =========================================================================
  // function to show the edit phone dialog
  Future<void> _showEditPhoneDialog({required String currentPhone}) async {
    final newPhone = await showEditPhoneDialog(
      context: context,
      currentPhone: currentPhone,
    );

    if (newPhone == null) return;

    final ok = await _controller.updatePhone(newPhone);

    if (!mounted) return;

    final message = ok
        ? 'driver_profile_snackbar_phone_updated'.translate
        : (_controller.errorMessage ?? 'driver_profile_snackbar_update_failed'.translate);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: ok ? Colors.green : _burgundy,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final profile = _controller.profile;
    final name = profile?.name ?? '';
    final phone = profile?.phone ?? '';

    final theme = Theme.of(context);

    final cs = theme.colorScheme;

    

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,

      // app bar ================================================================================
      appBar: AppBar(
        backgroundColor: theme.appBarTheme.backgroundColor,
        elevation: 0,
        toolbarHeight: 100,
        centerTitle: true,
        iconTheme: theme.appBarTheme.iconTheme,
        title: Image.asset(
          'assets/BusLogoWhite.png',
          width: 70,
          height: 70,
          fit: BoxFit.contain,
        ),
      ),

      // body ================================================================================
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'driver_profile_title'.translate,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: cs.onSurface,
                  ),
                ),

                //----------------------------------------------
                const SizedBox(height: 14),

                
                SectionCard(
                  borderColor: _border,
                  title: null,
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [

                            // driver name ----------------
                            Text(
                              name.isEmpty ? ' ' : name,
                              style:  TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: cs.onSurface,
                              ),
                            ),

                            const SizedBox(height: 4),

                            // driver phone ----------------
                            Text(
                              phone.isEmpty ? ' ' : phone,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: cs.onSurface,
                              ),
                            ),
                          ],
                        ),
                      ),
               
                    ],
                  ),
                ),

                //----------------------------------------------
                const SizedBox(height: 14),

                //----------------------------------------------
                SectionCard(
                  borderColor: _border,
                  title: 'driver_profile_contact_info'.translate,
                  child: Column(
                    children: [
                      // phone number ----------------
                      InfoRow(
                        label: 'driver_profile_phone_number'.translate,
                        value: phone.isEmpty ? ' ' : phone,
                        onEdit: profile == null
                            ? null
                            : () => _showEditPhoneDialog(currentPhone: phone),
                      ),
                      const SizedBox(height: 10),
                   
                      if (_controller.isLoading) ...[
                        const SizedBox(height: 10),
                        const LinearProgressIndicator(minHeight: 2),
                      ],
                      if (!_controller.isLoading && _controller.errorMessage != null) ...[
                        const SizedBox(height: 10),
                        Text(
                          _controller.errorMessage!,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: _burgundy,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),

                //----------------------------------------------
                const SizedBox(height: 14),

                //----------------------------------------------
                SectionCard(
                  borderColor: _border,
                  title: 'driver_profile_account_settings'.translate,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'driver_profile_language_preferences'.translate,
                        style:  TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: cs.onSurface ,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Center(
                        child: SettingsToggle(
                          selectedItemColor: _burgundy,
                          leftText: 'driver_profile_language_turkish'.translate,
                          rightText: 'driver_profile_language_english'.translate,
                          selectedRight: _englishSelected,
                          onChanged: (selectedRight) async {
                            setState(() {
                              _englishSelected = selectedRight;
                            });
                            
                            // Save language preference
                            final languageCode = selectedRight ? 'en' : 'tr';
                            await _prefs.saveLanguage(languageCode);
                            
                            // Update localization service
                            await DriverLocalizationService().changeLanguage(languageCode);
                          },
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'driver_profile_appearance'.translate,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: cs.onSurface,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Center(
                        child: SettingsToggle(
                          selectedItemColor: _burgundy,
                          leftText: 'driver_profile_appearance_dark'.translate,
                          rightText: 'driver_profile_appearance_light'.translate,
                          selectedRight: _lightSelected,
                          onChanged: (selectedRight) async {
                            setState(() {
                              _lightSelected = selectedRight;
                            });
                            
                            // Save appearance preference
                            final appearance = selectedRight ? 'light' : 'dark';
                            await _prefs.saveAppearance(appearance);

                            // Apply theme
                            await _themeService.changeTheme(appearance);
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      //===========================================================================

      // bottom bar ===============================================================
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _bottomIndex,
        onTap: (i) {
          if (i == _bottomIndex) return;

          if (i == 0) {
            Navigator.of(
              context,
            ).pushReplacement(_noAnimationRoute(const HomepageDriver()));
            return;
          }

          if (i == 1) {
            Navigator.of(
              context,
            ).pushReplacement(_noAnimationRoute(const BusSchedule()));
            return;
          }

          setState(() {
            _bottomIndex = i;
          });
        },
        type: BottomNavigationBarType.fixed,
        backgroundColor: _burgundy,
        selectedItemColor: _border,
        unselectedItemColor: Colors.white,
        showSelectedLabels: false,
        showUnselectedLabels: false,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: 'driver_profile_nav_home'.translate,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month_outlined),
            label: 'driver_profile_nav_calendar'.translate,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'driver_profile_nav_profile'.translate,
          ),
        ],
      ),

      //==============================================================================
    );
  }
}
//==============================================================================
// so we don't have animation bewteen surfing screens
PageRoute<void> _noAnimationRoute(Widget page) {
  return PageRouteBuilder<void>(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionDuration: Duration.zero,
    reverseTransitionDuration: Duration.zero,
  );
}
