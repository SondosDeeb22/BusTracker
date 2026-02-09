//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import '../../../services/localization_service.dart';
import '../../../services/theme_service.dart';

//========================================================

class AccountSettingsUser extends StatefulWidget {
  const AccountSettingsUser({super.key});

  @override
  State<AccountSettingsUser> createState() => _AccountSettingsUserState();
}

//========================================================

class _AccountSettingsUserState extends State<AccountSettingsUser> {
  static const _burgundy = Color(0xFF59011A);

  //? State variables for settings
  bool _turkishSelected = false;
  bool _darkSelected = false;
  bool _isLoading = true;

  //? Services
  final LocalizationService _localizationService = LocalizationService();
  final ThemeService _themeService = ThemeService();

  @override
  void initState() {
    super.initState();
    _loadPreferences();

    // Listen for language changes to rebuild UI
    _localizationService.addListener(_onLanguageChanged);
  }

  @override
  void dispose() {
    _localizationService.removeListener(_onLanguageChanged);
    super.dispose();
  }

  void _onLanguageChanged() {
    if (mounted) {
      setState(() {});
    }
  }

  // Load saved preferences from local storage ------------------------------------------------------
  Future<void> _loadPreferences() async {
    try {
      final turkishSelected = !_localizationService.isEnglish;
      final darkSelected = !_themeService.isLight;

      if (mounted) {
        setState(() {
          _turkishSelected = turkishSelected;
          _darkSelected = darkSelected;
          _isLoading = false;
        });
      }
      //--------------------------------
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error_outline, color: Colors.white, size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'settings_load_failed'.tr,
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF59001A),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        );
      }
    }
  }

  // -----------------------------------------------------
  // Save language preference to local storage

  Future<void> _saveLanguagePreference(bool isTurkish) async {
    try {
      final languageCode = isTurkish ? 'tr' : 'en';
      await _localizationService.changeLanguage(languageCode);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(
                  Icons.check_circle_outline,
                  color: Colors.white,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  'language_saved'.tr,
                  style: const TextStyle(color: Colors.white),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF59001A),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        );
      }
      //-----------------------------------------------------
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error_outline, color: Colors.white, size: 20),
                const SizedBox(width: 8),
                Text(
                  'language_failed'.tr,
                  style: const TextStyle(color: Colors.white),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF59001A),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        );
      }
    }
  }

  //========================================================================================
  // Save appearance preference to local storage
  Future<void> _saveAppearancePreference(bool isDark) async {
    try {
      final theme = isDark ? 'dark' : 'light';
      await _themeService.changeTheme(theme);
      //? Show success message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.check_circle_outline, color: Colors.white, size: 20),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'appearance_saved'.tr,
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF59001A),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        );
      }
      //--------------------------
    } catch (e) {
      //? Show error message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.error_outline, color: Colors.white, size: 20),
                SizedBox(width: 8),
                Text(
                  'appearance_failed'.tr,
                  style: const TextStyle(color: Colors.white),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF59001A),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        );
      }
    }
  }

  //========================================================================================
  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    // Show loading indicator while preferences are being loaded
    if (_isLoading) {
      return Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        appBar: AppBar(
          backgroundColor: colorScheme.primary,
          elevation: 0,
          centerTitle: true,
          iconTheme: IconThemeData(color: colorScheme.onPrimary),
          title: Image.asset(
            'assets/BusLogoWhite.png',
            width: 40,
            height: 40,
            fit: BoxFit.contain,
          ),
        ),
        body: const Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(_burgundy),
          ),
        ),
      );
    }
    // ===============================================================
    //===============================================================
    return Scaffold(
      backgroundColor: Theme.of(
        context,
      ).scaffoldBackgroundColor, // Use theme background
      // Building Top Bar =======================================================================================
      appBar: AppBar(
        backgroundColor: colorScheme.primary,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: colorScheme.onPrimary),
        title: Image.asset(
          'assets/BusLogoWhite.png',
          width: 40,
          height: 40,
          fit: BoxFit.contain,
        ),
        actions: [
          IconButton(
            onPressed: () {}, // no action becuase we're already in it
            icon: Icon(Icons.settings, color: colorScheme.onPrimary),
          ),
        ],
      ),

      //=======================================================================================
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 22),

          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,

            children: [
              //-----------------------------
              // Screen title
              Text(
                'title'.tr,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: colorScheme.onBackground,
                ),
              ),

              //-----------------------------
              const SizedBox(height: 10),

              //-----------------------------
              //dividor line
              Container(
                height: 1,
                width: double.infinity,
                color: colorScheme.secondary,
              ),

              //-----------------------------
              const SizedBox(height: 26),

              //-----------------------------
              Text(
                'Language Preferences',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: colorScheme.onBackground,
                ),
              ),

              //-----------------------------
              const SizedBox(height: 14),

              //-----------------------------
              //Language options
              Center(
                child: _SettingsToggle(
                  selectedItemColor: _burgundy,
                  leftText: 'english'.tr,
                  rightText: 'turkish'.tr,
                  selectedRight: _turkishSelected,
                  onChanged: (selectedRight) {
                    setState(() {
                      _turkishSelected = selectedRight;
                    });
                    // Save language preference to local storage
                    _saveLanguagePreference(selectedRight);
                  },
                ),
              ),

              //-----------------------------
              const SizedBox(height: 44),

              //-----------------------------
              Text(
                'appearance'.tr,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: colorScheme.onBackground,
                ),
              ),

              //-----------------------------
              const SizedBox(height: 14),

              //-----------------------------
              // apperance options
              Center(
                child: _SettingsToggle(
                  selectedItemColor: _burgundy,
                  leftText: 'light'.tr,
                  rightText: 'dark'.tr,
                  selectedRight: _darkSelected,
                  onChanged: (selectedRight) {
                    setState(() {
                      _darkSelected = selectedRight;
                    });
                    // Save appearance preference to local storage
                    _saveAppearancePreference(selectedRight);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

//========================================================

class _SettingsToggle extends StatelessWidget {
  final Color selectedItemColor;
  final String leftText;
  final String rightText;
  final bool selectedRight;
  final ValueChanged<bool> onChanged;

  const _SettingsToggle({
    required this.selectedItemColor,
    required this.leftText,
    required this.rightText,
    required this.selectedRight,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      width: 260,
      height: 44,
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colorScheme.secondary),
      ),

      child: Row(
        children: [
          // left option ----------------------------------------------------------------------
          Expanded(
            child: InkWell(
              onTap: () => onChanged(false),
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: selectedRight ? Colors.transparent : selectedItemColor,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  leftText,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: selectedRight
                        ? colorScheme.onSurface
                        : colorScheme.onPrimary,
                  ),
                ),
              ),
            ),
          ),

          // right option ---------------------------------------------------------------------
          Expanded(
            child: InkWell(
              onTap: () => onChanged(true),
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: selectedRight ? selectedItemColor : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  rightText,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: selectedRight
                        ? colorScheme.onPrimary
                        : colorScheme.onSurface,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
