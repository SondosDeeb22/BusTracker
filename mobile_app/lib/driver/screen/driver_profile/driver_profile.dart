//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

import '../homepage_driver/homepage_driver.dart';
import '../weekly_bus_schedule/weekly_bus_schedule.dart';

//========================================================

class DriverProfile extends StatefulWidget {
  const DriverProfile({super.key});

  @override
  State<DriverProfile> createState() => _DriverProfileState();
}

class _DriverProfileState extends State<DriverProfile> {
  static const _burgundy = Color(0xFF59011A);
  static const _bg = Color(0xFFF2F1ED);
  static const _border = Color(0xFFC9A47A);

  int _bottomIndex = 2;

  bool _englishSelected = true;
  bool _lightSelected = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,

      // app bar ================================================================================
      appBar: AppBar(
        backgroundColor: _burgundy,
        elevation: 0,
        toolbarHeight: 100,
        centerTitle: true,
        iconTheme: const IconThemeData(color: _bg),
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
                const Text(
                  'Profile',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: Colors.black,
                  ),
                ),

                //----------------------------------------------
                const SizedBox(height: 14),

                _SectionCard(
                  borderColor: _border,
                  title: null,
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'Adam Jolian',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: Colors.black,
                              ),
                            ),

                            SizedBox(height: 4),

                            Text(
                              '145287958',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: Colors.black54,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const CircleAvatar(
                        radius: 18,
                        backgroundColor: Color(0xFFE6E6E6),
                        child: Icon(Icons.person, color: Colors.white),
                      ),
                    ],
                  ),
                ),

                //----------------------------------------------
                const SizedBox(height: 14),

                //----------------------------------------------
                _SectionCard(
                  borderColor: _border,
                  title: 'Contact info',
                  child: Column(
                    children: const [
                      _InfoRow(
                        label: 'Phone number',
                        value: '+90 544 616 8122',
                      ),
                      SizedBox(height: 10),
                      _InfoRow(
                        label: 'Address',
                        value: 'Atalar Mahallesi, Kurtan Sokak, No: 75',
                      ),
                      SizedBox(height: 10),
                      _InfoRow(
                        label: 'Emergency Contact',
                        value: '+90 521 669 6253 (brother)',
                      ),
                    ],
                  ),
                ),

                //----------------------------------------------
                const SizedBox(height: 14),

                //----------------------------------------------
                _SectionCard(
                  borderColor: _border,
                  title: 'Account Settings',
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Language Preferences',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Center(
                        child: _SettingsToggle(
                          selectedItemColor: _burgundy,
                          leftText: 'Turkish',
                          rightText: 'English',
                          selectedRight: _englishSelected,
                          onChanged: (selectedRight) {
                            setState(() {
                              _englishSelected = selectedRight;
                            });
                          },
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Appearance',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Center(
                        child: _SettingsToggle(
                          selectedItemColor: _burgundy,
                          leftText: 'Dark',
                          rightText: 'Light',
                          selectedRight: _lightSelected,
                          onChanged: (selectedRight) {
                            setState(() {
                              _lightSelected = selectedRight;
                            });
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
            ).pushReplacement(_noAnimationRoute(const WeeklyBusSchedule()));
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
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month_outlined),
            label: 'Calendar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
        ],
      ),

      //==============================================================================
    );
  }
}
//==============================================================================

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
    return Container(
      width: 260,
      height: 44,
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE7D7C2)),
      ),

      child: Row(
        children: [
          // control the left-side of the toggle (Operating) ---------------------------------------------------------------
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
                    color: selectedRight ? Colors.black : Colors.white,
                  ),
                ),
              ),
            ),
          ),

          // control the right-side of the toggle ---------------------------------------------------------------
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
                    color: selectedRight ? Colors.white : Colors.black,
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

// so we don't have meaningless animation bewteen surfing screens
PageRoute<void> _noAnimationRoute(Widget page) {
  return PageRouteBuilder<void>(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionDuration: Duration.zero,
    reverseTransitionDuration: Duration.zero,
  );
}

// build card as template ========================================================

class _SectionCard extends StatelessWidget {
  final Color borderColor;
  final String? title;
  final Widget child;

  const _SectionCard({
    required this.borderColor,
    required this.title,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0x00FFFFFF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor, width: 1),
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title != null) ...[
            Text(
              title!,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: Colors.black,
              ),
            ),

            const SizedBox(height: 12),
          ],

          child,
        ],
      ),
    );
  }
}

// build row for informaion ========================================================

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: Colors.black,
                ),
              ),

              //-----------------------------
              const SizedBox(height: 4),

              //-----------------------------
              Text(
                value,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Colors.black54,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(width: 10),

        //add the "edit" icon
        const Icon(Icons.edit, size: 18, color: Color(0xFF59011A)),
      ],
    );
  }
}
