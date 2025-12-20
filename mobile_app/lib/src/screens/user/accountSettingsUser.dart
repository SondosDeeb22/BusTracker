//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';

//========================================================

class AccountSettingsUser extends StatefulWidget {
  const AccountSettingsUser({super.key});

  @override
  State<AccountSettingsUser> createState() => _AccountSettingsUserState();
}

//========================================================

class _AccountSettingsUserState extends State<AccountSettingsUser> {
  static const _burgundy = Color(0xFF59011A);
  static const _bg = Color(0xFFF2F1ED);
  static const _border = Color(0xFFC9A47A);

  bool _englishSelected = true;
  bool _lightSelected = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg, // Background of the whole page
      // Building Top Bar =======================================================================================
      appBar: AppBar(
        backgroundColor: _burgundy,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: _bg),
        title: Image.asset(
          'assets/BusLogoWhite.png',
          width: 40,
          height: 40,
          fit: BoxFit.contain,
        ),
        actions: [
          IconButton(
            onPressed: () {}, // no action becuase we're already in it
            icon: const Icon(Icons.settings, color: _bg),
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
              const Text(
                'Account Settings',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: Colors.black,
                ),
              ),

              //-----------------------------
              const SizedBox(height: 10),

              //-----------------------------
              //dividor line
              Container(height: 1, width: double.infinity, color: _border),

              //-----------------------------
              const SizedBox(height: 26),

              //-----------------------------
              const Text(
                'Language Preferences',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.black,
                ),
              ),

              //-----------------------------
              const SizedBox(height: 14),

              //-----------------------------
              //Language options
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
                    // TODO: apply language change
                  },
                ),
              ),

              //-----------------------------
              const SizedBox(height: 44),

              //-----------------------------
              const Text(
                'Appearance',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.black,
                ),
              ),

              //-----------------------------
              const SizedBox(height: 14),

              //-----------------------------
              // apperance options
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
                    // TODO: apply theme change
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
                    color: selectedRight ? Colors.black : Colors.white,
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
