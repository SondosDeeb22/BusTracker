//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import '../homepage_user/homepage_user.dart';
import '../../../services/localization_service.dart';

//========================================================
class CoverPage extends StatefulWidget {
  const CoverPage({super.key});

  @override
  State<CoverPage> createState() => _CoverPageState();
}

//========================================================

class _CoverPageState extends State<CoverPage> {
  late final LocalizationService _localizationService;

  @override
  void initState() {
    super.initState();
    _localizationService = LocalizationService();
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

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Also rebuild when dependencies change (including locale)
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Upper part (Logo) -------------------------------------
            Container(
              height: 500,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
                borderRadius: BorderRadius.only(),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image(
                    image: AssetImage('assets/BusLogoWhite.png'),
                    width: 150,
                    height: 150,
                  ),

                  SizedBox(height: 80),

                  Text(
                    'app_title'.tr,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 30,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            // Lower section with button -------------------------------------
            Expanded(
              child: Container(
                color: Theme.of(context).scaffoldBackgroundColor,

                child: Center(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const HomepageUser()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      padding: EdgeInsets.symmetric(
                        horizontal: 50,
                        vertical: 16,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                    // Button content and styling ----------
                    child: Text(
                      'explore_buses'.tr,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
