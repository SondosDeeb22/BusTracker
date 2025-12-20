//========================================================
//? importing
//========================================================
import 'package:flutter/material.dart';
import 'accountSettingsUser.dart';
//========================================================

// rendering user homepage screen, that contains :

// - a top AppBar (logo + settings)
// - status cards (working buses / total buses)
// - a toggle (Working / All)
// - a list of bus routes with a "View Location" button
class HomepageUser extends StatefulWidget {
  const HomepageUser({super.key});

  @override
  State<HomepageUser> createState() => _HomepageUserState();
}

//========================================================

// The State class holds all mutable values for HomepageUser.
// When we call setState(...), Flutter rebuilds the UI using the updated values
class _HomepageUserState extends State<HomepageUser> {
  bool _showAll = false;

  // Theme/colors used across this screen (kept here so you can reuse them easily).
  static const _burgundy = Color(0xFF59011A);
  static const _bg = Color(0xFFF2F1ED);
  static const _cardBg = Color(0xFFE7E0D6);
  static const _border = Color(0xFFC9A47A);

  // Temporary hard-coded routes.
  // Later you can replace this list with data coming from your backend / API.
  final List<_BusRouteCardModel> _routes = const [
    _BusRouteCardModel(
      name: 'Gonyle 1',
      color: Color.fromARGB(255, 128, 0, 207),
      hasLocation: true,
    ),
    _BusRouteCardModel(
      name: 'Lefkosa',
      color: Color(0xFF41B82D),
      hasLocation: true,
    ),
    _BusRouteCardModel(
      name: 'Yenikent / Gönyeli',
      color: Color.fromARGB(255, 0, 13, 197),
      hasLocation: true,
    ),
    _BusRouteCardModel(
      name: 'Kızılbaş',
      color: Color.fromARGB(255, 255, 235, 13),
      hasLocation: false,
    ),
    _BusRouteCardModel(
      name: 'Guzelyurt',
      color: Color.fromARGB(255, 111, 202, 132),
      hasLocation: false,
    ),
    _BusRouteCardModel(
      name: 'Famagusta',
      color: Color.fromARGB(255, 34, 211, 238),
      hasLocation: false,
    ),
    _BusRouteCardModel(
      name: 'Kyrenia',
      color: Color.fromARGB(255, 249, 115, 22),
      hasLocation: false,
    ),
  ];

  //========================================================
  @override
  Widget build(BuildContext context) {
    // Counters used in the top status cards
    final workingCount = _routes.where((r) => r.hasLocation).length;
    final totalCount = _routes.length;

    // Decide which routes to show depending on the toggle
    final visibleRoutes = _showAll
        ? _routes
        : _routes.where((r) => r.hasLocation).toList();

    return Scaffold(
      
      backgroundColor: _bg,// Background of the whole page

      // Building Top Bar =======================================================================================
      appBar: AppBar(
        backgroundColor: _burgundy,
        elevation: 0,
        centerTitle: true,

        // set "return" arrow's color
        iconTheme: const IconThemeData(color: _bg),

        // Logo in the center of AppBar.
        title: Image.asset(
          'assets/BusLogoWhite.png',
          width: 40,
          height: 40,
          fit: BoxFit.contain,
        ),

        // Right-side icons in AppBar.
        actions: [
          IconButton(
            // TODO: open settings screen.
            onPressed: () {
              Navigator.of(context,).push(
                MaterialPageRoute(
                builder: (_) => 
                const AccountSettingsUser()
                )
              );
            },
            icon: const Icon(Icons.settings, color: _bg),
          ),
        ],
      ),

      //=======================================================================================
      body: SafeArea(
        //-------------------------------------------------------------------------------------------------------
        // Makes the page scrollable so it fits all screen sizes.
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,

              children: [
                const SizedBox(height: 6),

                //-----------------------------
                // Screen title
                const Text(
                  'Live Buses Status',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: Colors.black,
                  ),
                ),

                //-----------------------------
                const SizedBox(height: 18),

                //-----------------------------
                // The two status cards row.
                Row(
                  children: [
                    Expanded(
                      child: _StatCard(
                        borderColor: _border,
                        title: 'Currently Working',
                        value: '$workingCount Buses',
                      ),
                    ),

                    const SizedBox(width: 18),

                    Expanded(
                      child: _StatCard(
                        borderColor: _border,
                        title: 'Total Buses',
                        value: '$totalCount',
                      ),
                    ),
                  ],
                ),

                //-----------------------------
                const SizedBox(height: 22),

                //-----------------------------
                // Divider line.
                Container(height: 1, width: double.infinity, color: _border),

                //-----------------------------
                const SizedBox(height: 22),

                //-----------------------------
                // Toggle "Working" vs "All".
                // When it changes, we call setState to rebuild and show different list items.
                Center(
                  child: _SegmentedToggle(
                    burgundy: _burgundy,
                    selectedRight: _showAll,

                    leftText: 'Operating',
                    rightText: 'All',

                    onChanged: (value) {
                      setState(() {
                        _showAll = value;
                      });
                    },
                  ),
                ),

                //-----------------------------
                const SizedBox(height: 18),

                //-----------------------------
                // The list of route cards.
                Column(
                  children: [
                    for (final route
                        in visibleRoutes) // visibleReoutes contains the routes (either all of them or only operating ones)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 16),

                        // Each route in the list becomes one UI card.
                        child: _RouteCard(
                          background: _cardBg,
                          routeName: route.name,
                          routeColor: route.color,

                          // In the "All" tab we hide the View Location button (your design).
                          // In the "Working" tab we show it (only for routes that have location).
                          showViewLocationButton:
                              !_showAll && route.hasLocation,

                          // TODO: navigate to map screen for this route
                          onViewLocation: () {},
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

//  ========================================================

// Simple data model for a route card (only name + color).
// We keep it separate so the UI can be built from data.
class _BusRouteCardModel {
  final String name;
  final Color color;
  final bool hasLocation;

  const _BusRouteCardModel({
    required this.name,
    required this.color,
    required this.hasLocation,
  });
}

// Live Buses status's card on top ========================================================

class _StatCard extends StatelessWidget {
  // Border color around the card
  final Color borderColor;

  // Title label and value shown inside card.
  final String title;
  final String value;

  const _StatCard({
    required this.borderColor,
    required this.title,
    required this.value,
  });

  //-------------------------------
  @override
  Widget build(BuildContext context) {
    // One reusable card widget used for the "Currently Working" and "Total Buses" cards -----------------------------
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      decoration: BoxDecoration(
        color: const Color(0x00FFFFFF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor, width: 1),
      ),

      //-----------------------------
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Small title text.
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              color: Colors.black,
              fontWeight: FontWeight.w500,
            ),
          ),

          //-----------------------------
          const SizedBox(height: 10),

          //-----------------------------
          // Main value text.
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              color: Colors.black,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

//Custom segmented control widget ========================================================================================
// It behaves like two buttons, and tells the parent which side is selecte

class _SegmentedToggle extends StatelessWidget {
  final Color burgundy;
  final bool
  selectedRight; // true -> right option 'All'  -  false -> left option 'operating'
  final String leftText;
  final String rightText;

  // Callback to notify parent when selection changes.
  final ValueChanged<bool> onChanged;

  const _SegmentedToggle({
    required this.burgundy,
    required this.selectedRight,
    required this.leftText,
    required this.rightText,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    // Wrapper container that draws the border and rounded edges of toggle button box =========================================
    return Container(
      width: 280,
      height: 44,
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE7D7C2)),
      ),

      //-------------------------------------------------------------------------------------------------------------------------------------------------
      child: Row(
        children: [
          
          // left option (Operating) ----------------------------------------------------------------------
          Expanded(
            child: InkWell( // InkWell is widget used to capture interaction(tap) events and provide visual effect                            
              onTap: () => onChanged(false),

              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: selectedRight ? Colors.transparent : burgundy,
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

          // right option (All) ---------------------------------------------------------------------
          Expanded(
            child: InkWell(              
              onTap: () => onChanged(true),

              child: Container(
                decoration: BoxDecoration(
                  color: selectedRight ? burgundy : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,

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

//  build Routes card  ========================================================
class _RouteCard extends StatelessWidget {
  // Background color of the outer card.
  final Color background;

  // Route label and its badge color.
  final String routeName;
  final Color routeColor;

  // Action when user taps "View Location".
  final VoidCallback onViewLocation;

  // If false, the button is hidden and the colored route bar expands full width ( this is used when we view ALL routes)
  final bool showViewLocationButton;

  const _RouteCard({
    required this.background,
    required this.routeName,
    required this.routeColor,
    required this.onViewLocation,
    required this.showViewLocationButton,
  });

  @override
  Widget build(BuildContext context) {
    // One row card:
    // - Left: colored badge with route name
    // - Right: "View Location" button

    //container  of the whole card ui --------------------------------------------------------------------------------------------------------------------
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      decoration: BoxDecoration(
        color: background, // this color is setted to be begi for all cards
        borderRadius: BorderRadius.circular(14),
      ),

      //-----------------------------
      child: Row(
        children: [
          Expanded(
            // set the inside route card's color
            child: Container(
              height: 46,
              decoration: BoxDecoration(
                color: routeColor,
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.centerLeft,
              padding: const EdgeInsets.symmetric(horizontal: 18),

              // set the title of the route
              child: Text(
                routeName,
                style: TextStyle(
                  color: _textColorFor(
                    routeColor,
                  ), // function to choose the color (white or black) -> background brightness
                  fontWeight: FontWeight.w500,
                  fontSize: 18,
                ),
              ),
            ),
          ),

          // add locaiton button if the bus is operating ----------------------------------------------------------
          if (showViewLocationButton) ...[
            const SizedBox(width: 12),

            //-----------------------------
            SizedBox(
              width: 78,
              height: 46,

              // Button to view bus location-----------------------------
              child: OutlinedButton(
                onPressed: onViewLocation,
                style: OutlinedButton.styleFrom(
                  backgroundColor: const Color(0xFFF5EFE6),
                  side: const BorderSide(color: Color(0xFFE4D4BF)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                ),

                child: const Text(
                  'View\nLocation',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: Colors.black,
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  // function used to determine the appropriate text color(white or black) for route title
  // according to the brightness of the route's background color

  Color _textColorFor(Color bg) {
    // Estimate brightness to pick readable text color.
    // Dark background => white text, light background => black text.
    final brightness = ThemeData.estimateBrightnessForColor(bg);
    return brightness == Brightness.dark ? Colors.white : Colors.black;
  }
}
